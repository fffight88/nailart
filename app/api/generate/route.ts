import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { genai } from '@/lib/gemini'
import { THUMBNAIL_SYSTEM_PROMPT } from '@/lib/system-prompt'

export const maxDuration = 60

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const prompt = body.prompt?.trim()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    if (prompt.length > 1000) {
      return NextResponse.json(
        { error: 'Prompt must be under 1000 characters' },
        { status: 400 }
      )
    }

    // Validate attached images (max 10, each max 5MB base64 ≈ 6.67MB encoded)
    const images: { data: string; mimeType: string }[] = body.images || []
    if (images.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 images allowed' },
        { status: 400 }
      )
    }
    for (const img of images) {
      const sizeBytes = (img.data.length * 3) / 4
      if (sizeBytes > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: 'Each image must be under 5MB' },
          { status: 400 }
        )
      }
    }

    // Insert thumbnail record
    const { data: thumbnail, error: insertError } = await supabase
      .from('thumbnails')
      .insert({
        user_id: user.id,
        prompt,
        status: 'generating',
      })
      .select()
      .single()

    if (insertError || !thumbnail) {
      console.error('Insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create thumbnail record' },
        { status: 500 }
      )
    }

    // Call Gemini API: try 3-pro first, fallback to 2.5-flash (each with retry)
    const MODELS = [
      { id: 'gemini-3-pro-image-preview', imageSize: '2K', retries: 1 },
      { id: 'gemini-2.5-flash-image', imageSize: undefined, retries: 2 },
    ] as const

    let imageBuffer: Buffer | null = null
    let lastError: unknown

    for (const model of MODELS) {
      for (let attempt = 1; attempt <= model.retries; attempt++) {
        try {
          console.log(`Trying ${model.id} (attempt ${attempt}/${model.retries})`)
          // Build contents: text prompt + optional image parts
          const contentParts: ({ text: string } | { inlineData: { mimeType: string; data: string } })[] = [
            { text: `${THUMBNAIL_SYSTEM_PROMPT} ${prompt}` },
            ...images.map((img) => ({
              inlineData: { mimeType: img.mimeType, data: img.data },
            })),
          ]

          const response = await genai.models.generateContent({
            model: model.id,
            contents: contentParts,
            config: {
              responseModalities: ['TEXT', 'IMAGE'],
              imageConfig: {
                aspectRatio: '16:9',
                ...(model.imageSize && { imageSize: model.imageSize }),
              },
            },
          })

          const parts = response.candidates?.[0]?.content?.parts
          const imagePart = parts?.find(
            (part) => part.inlineData?.mimeType?.startsWith('image/')
          )

          if (!imagePart?.inlineData?.data) {
            const textPart = parts?.find((p) => p.text)
            throw new Error(
              textPart?.text
                ? `No image returned. Model said: ${textPart.text.slice(0, 200)}`
                : 'No image returned from Gemini'
            )
          }

          imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64')
          console.log(`Success with ${model.id}`)
          break
        } catch (err) {
          console.error(`${model.id} attempt ${attempt} failed:`, err)
          lastError = err
          if (attempt < model.retries) {
            await new Promise((r) => setTimeout(r, 1000))
          }
        }
      }
      if (imageBuffer) break
    }

    if (!imageBuffer) {
      await supabase
        .from('thumbnails')
        .update({ status: 'failed' })
        .eq('id', thumbnail.id)

      console.error('All attempts failed:', lastError)
      return NextResponse.json(
        { error: 'Image generation failed. Please try again.' },
        { status: 502 }
      )
    }

    // Upload to Supabase Storage
    const storagePath = `${user.id}/${thumbnail.id}.png`

    const { error: uploadError } = await supabase.storage
      .from('thumbnails')
      .upload(storagePath, imageBuffer, {
        contentType: 'image/png',
        upsert: false,
      })

    if (uploadError) {
      await supabase
        .from('thumbnails')
        .update({ status: 'failed' })
        .eq('id', thumbnail.id)

      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to save generated image' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('thumbnails')
      .getPublicUrl(storagePath)

    // Update thumbnail record
    const { data: updatedThumbnail, error: updateError } = await supabase
      .from('thumbnails')
      .update({
        image_url: publicUrlData.publicUrl,
        storage_path: storagePath,
        status: 'completed',
      })
      .eq('id', thumbnail.id)
      .select()
      .single()

    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to update thumbnail record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ thumbnail: updatedThumbnail })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
