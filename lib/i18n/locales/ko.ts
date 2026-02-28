import type { Translations } from './en'

export const ko: Translations = {
  nav: {
    features: '기능',
    pricing: '요금제',
    contact: '문의',
    getStarted: '시작하기',
  },

  hero: {
    title: 'AI-Powered YouTube Thumbnails',
    subtitle: 'Thumbnail Generator',
    description: '영상 주제를 입력하면 클릭을 부르는 썸네일을 몇 초 만에 만들어 드립니다.',
    cta: '무료로 시작하기',
    features: [
      { title: 'Realistic Results', description: '전문가가 만든 듯한 고퀄리티 이미지' },
      { title: 'Fast Generation', description: '아이디어를 몇 초 만에 이미지로 변환' },
      { title: 'Diverse Styles', description: '폭넓은 아티스틱 옵션을 선택 가능' },
    ],
  },

  features: {
    label: '기능',
    heading: 'More Views. Zero Editing.',
    subheading: '복잡한 프로그램은 버리세요. 알고리즘을 부수는 전문가급 썸네일을 만드는 데 필요한 모든 것이 클릭 한 번에 끝납니다.',
    items: [
      {
        title: 'Zero-Effort Magic Brush',
        description: '단어 하나만 입력하세요. 복잡한 프롬프트 공부 없이도 AI가 알아서 조회수를 부르는 드라마틱한 장면을 설계합니다.',
      },
      {
        title: 'Flawless Native Typography',
        description: '더 이상 깨진 AI 글자로 스트레스받지 마세요. 이미지 속에 완벽하게 녹아드는 선명한 한글과 영어 자막을 즉시 생성합니다.',
      },
      {
        title: 'Engineered to Click',
        description: '시각 심리학을 적용했습니다. 알고리즘의 선택을 받기 위한 최적의 보색 대비, 시선 처리, 표정 묘사로 클릭률을 극대화합니다.',
      },
      {
        title: 'Ultra-Sharp 2K Fidelity',
        description: '흐릿한 AI 특유의 노이즈는 잊으세요. 대형 모니터에서도 선명한 전문가급 2K 해상도로 프리미엄 채널의 품격을 완성합니다.',
      },
      {
        title: 'Seamless Style Mastery',
        description: '실사부터 3D, 웹툰, 사이버펑크까지. 클릭 한 번으로 내 채널의 정체성에 딱 맞는 최적의 스타일을 입혀보세요.',
      },
    ],
  },

  landingPricing: {
    label: '요금제',
    heading: 'Simple, transparent pricing',
    subheading: '무료로 시작하고, 더 많은 기능이 필요할 때 업그레이드하세요.',
    mostPopular: '가장 인기',
    month: '/월',
    creditsIncluded: '크레딧 포함',
    features: {
      creditsPerMonth: '{n} 크레딧/월',
      aiThumbnailGeneration: 'AI 썸네일 생성',
      referenceImageSupport: '레퍼런스 이미지 지원',
      multiLanguageTextRendering: '다국어 텍스트 렌더링',
      bestValuePerCredit: '크레딧당 최고 가성비',
    },
    getPlan: '{name} 구독하기',
  },

  cta: {
    heading: 'Start creating thumbnails that get clicks',
    subheading: '',
    button: '무료로 시작하기',
  },

  footer: {
    features: '기능',
    pricing: '요금제',
    privacy: 'Privacy',
    terms: 'Terms',
    allRightsReserved: 'All rights reserved.',
  },

  auth: {
    welcome: '환영합니다',
    welcomeBack: '다시 오신 걸 환영합니다',
    signInDesktop: '로그인하여 AI 썸네일을 만들어 보세요',
    signInMobile: '로그인하여 멋진 썸네일을 만들어 보세요',
    continueWithGoogle: 'Google로 계속하기',
    agreeDesktop: '로그인 시 다음에 동의하는 것으로 간주됩니다:',
    agreeMobile: '계속 진행 시 다음에 동의하는 것으로 간주됩니다:',
    terms: '이용약관',
    termsOfService: '이용약관',
    and: '및',
    privacyPolicy: '개인정보처리방침',
  },

  dashboard: {
    toggleSidebar: '사이드바 토글',
    plan: '플랜',
    credits: '크레딧',
    upgrade: '업그레이드',
    manageSubscription: '구독 관리',
    loading: '로딩 중...',
    signOut: '로그아웃',
    toggleTheme: '테마 전환',
    toggleLanguage: '언어 전환',
  },

  prompt: {
    heading: '어떤 썸네일을 만들고 싶으신가요?',
    placeholders: [
      '네온 배경에 선글라스를 쓴 고양이...',
      '드라마틱한 조명의 게임 하이라이트...',
      '미니멀한 테크 리뷰 썸네일...',
      '비포 앤 애프터 변환 분할...',
      '대담한 텍스트와 충격 리액션 얼굴...',
    ],
    notAnImage: '이미지가 아닙니다',
    exceeds5MB: '5MB를 초과합니다',
    maxAttachments: '최대 {n}개 첨부 가능',
    timedOut: '생성 시간이 초과되었습니다. 다시 시도해 주세요.',
    somethingWentWrong: '문제가 발생했습니다',
    download: '다운로드',
    generationFailed: '생성 실패',
    tryAgain: '다시 시도',
    myThumbnails: '내 썸네일',
    attachExisting: '기존 항목 첨부',
    attachImages: '이미지 첨부',
    uploadImages: '이미지 업로드',
    voiceInput: '음성 입력',
    generating: '생성 중...',
    generate: '생성',
    helper: '썸네일 아이디어를 설명하면 AI가 나머지를 처리합니다',
    removeAttachment: '첨부 제거',
  },

  sidebar: {
    myThumbnails: '내 썸네일',
    noThumbnails: '아직 썸네일이 없습니다',
    generateFirst: '첫 번째 썸네일을 만들어 보세요!',
    copied: '복사됨!',
    copyPrompt: '프롬프트 복사',
  },

  pricing: {
    chooseYourPlan: '요금제를 선택하세요',
    close: '닫기',
    current: '현재',
    currentPlan: '현재 플랜',
    downgrade: '다운그레이드',
    getPlan: '{name} 구독하기',
    upgradeConfirm: '{plan}으로 업그레이드할까요?',
    upgradeMessage: '비례 차액이 즉시 카드에 청구됩니다. 200 보너스 크레딧이 바로 지급됩니다.',
    cancel: '취소',
    upgrading: '업그레이드 중...',
    confirmUpgrade: '업그레이드 확인',
    credits: '크레딧',
  },
}
