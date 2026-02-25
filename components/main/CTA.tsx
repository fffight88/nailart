'use client'

import { useEffect, useRef } from 'react'

const FRAG = `
#define MAX_COLORS 8
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

  vec3 col = vec3(0.0);
  if (uColorCount > 0) {
    vec2 s = q;
    vec3 sumCol = vec3(0.0);
    for (int i = 0; i < MAX_COLORS; ++i) {
      if (i >= uColorCount) break;
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m = mix(
        length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0),
        length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0),
        kMix
      );
      float w = 1.0 - exp(-6.0 / exp(6.0 * m));
      sumCol += uColors[i] * w;
    }
    col = clamp(sumCol, 0.0, 1.0);
  } else {
    vec2 s = q;
    for (int k = 0; k < 3; ++k) {
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m = mix(
        length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0),
        length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0),
        kMix
      );
      col[k] = 1.0 - exp(-6.0 / exp(6.0 * m));
    }
  }

  col = pow(col, vec3(0.3));

  if (uNoise > 0.0001) {
    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
    col += (n - 0.5) * uNoise;
    col = clamp(col, 0.0, 1.0);
  }

  gl_FragColor = vec4(col, 1.0);
}
`

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const COLORS = ['#1a1a24', '#3d3d4d', '#6b6b78']

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}

export default function CTA() {
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = canvasRef.current
    if (!container) return

    let destroyed = false

    import('three').then((THREE) => {
      if (destroyed) return

      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

      const uColorsArray = Array.from({ length: 8 }, () => new THREE.Vector3(0, 0, 0))
      COLORS.forEach((hex, i) => {
        const [r, g, b] = hexToRgb(hex)
        uColorsArray[i].set(r, g, b)
      })

      const material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: {
          uCanvas: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 0 },
          uSpeed: { value: 0.35 },
          uRot: { value: new THREE.Vector2(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)) },
          uColorCount: { value: COLORS.length },
          uColors: { value: uColorsArray },
          uScale: { value: 0.5 },
          uFrequency: { value: 1.2 },
          uWarpStrength: { value: 1.0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uMouseInfluence: { value: 0.5 },
          uParallax: { value: 0.3 },
          uNoise: { value: 0.05 },
        },
      })

      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
      scene.add(mesh)

      const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: false, preserveDrawingBuffer: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setClearColor(0x000000, 1)

      const canvas = renderer.domElement
      canvas.className = 'cta-shader-canvas'
      container.appendChild(canvas)

      const clock = new THREE.Clock()
      let prevW = 0
      let prevH = 0
      const pointerTarget = new THREE.Vector2(0, 0)
      const pointerCurrent = new THREE.Vector2(0, 0)

      const onPointerMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect()
        pointerTarget.set(
          ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1,
          -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1)
        )
      }
      container.addEventListener('pointermove', onPointerMove)

      let raf: number

      const loop = () => {
        if (destroyed) return

        const dt = clock.getDelta()
        const elapsed = clock.elapsedTime
        material.uniforms.uTime.value = elapsed

        // Resize check every frame
        const w = container.clientWidth
        const h = container.clientHeight
        if (w > 0 && h > 0 && (w !== prevW || h !== prevH)) {
          prevW = w
          prevH = h
          renderer.setSize(w, h, false)
          material.uniforms.uCanvas.value.set(w, h)
        }

        pointerCurrent.lerp(pointerTarget, Math.min(1, dt * 8))
        material.uniforms.uPointer.value.copy(pointerCurrent)

        renderer.render(scene, camera)
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)

      // Store cleanup
      const cleanup = () => {
        destroyed = true
        cancelAnimationFrame(raf)
        container.removeEventListener('pointermove', onPointerMove)
        mesh.geometry.dispose()
        material.dispose()
        renderer.dispose()
        if (canvas.parentElement === container) {
          container.removeChild(canvas)
        }
      }
      ;(container as unknown as Record<string, () => void>).__cleanup = cleanup
    })

    return () => {
      destroyed = true
      const fn = (container as unknown as Record<string, (() => void) | undefined>).__cleanup
      if (fn) fn()
    }
  }, [])

  return (
    <section id="contact" className="px-6 py-20">
      <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/[0.08]">
        {/* Shader background */}
        <div ref={canvasRef} className="absolute inset-0 z-0" />

        {/* Colorband Background */}
        {/* <div className="absolute inset-0 w-full h-full z-0 grayscale blur-2xl" /> */}
        <div className="absolute inset-0 z-[1] bg-black/20" />

        {/* Content */}
        <div className="relative z-[2] flex flex-col items-center text-center py-20 px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight max-w-lg">
            Start creating thumbnails that get clicks
          </h2>
          <p className="mt-4 text-white/60 text-lg max-w-md">
            Join creators who use AI to design scroll-stopping YouTube thumbnails in seconds.
          </p>
          <a
            href="/auth"
            className="mt-8 inline-flex items-center gap-2 py-3.5 px-8 rounded-xl bg-white text-[#181818] text-sm font-semibold no-underline transition-opacity hover:opacity-90 shadow-[0_8px_32px_rgba(255,255,255,0.1)]"
          >
            Get Started Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
