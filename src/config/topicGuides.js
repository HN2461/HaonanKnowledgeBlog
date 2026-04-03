export const topicGuides = {
  'uni-app': {
    title: 'uni-app 专题学习路线',
    description: '建议先建立跨端共性认知，再进入微信小程序平台篇。这样读时更容易分清通用能力、平台协议和宿主差异。',
    sections: {
      'uni-app/通用基础': {
        order: 1,
        eyebrow: '建议先读',
        summary: '先把跨端编译、生命周期、工程结构、路由请求缓存、条件编译这些共性基础打牢。',
        actionLabel: '先打基础'
      },
      'uni-app/微信小程序': {
        order: 2,
        eyebrow: '再进平台篇',
        summary: '在通用基础之上继续看微信宿主差异、页面协议、微信专属能力和真机项目治理。',
        actionLabel: '进入微信篇'
      }
    }
  }
}

export const getTopicGuide = (categoryPath = '') => {
  return topicGuides[String(categoryPath || '')] || null
}

export const getTopicGuideSection = (categoryPath = '', sectionPath = '') => {
  const guide = getTopicGuide(categoryPath)
  if (!guide || !guide.sections) {
    return null
  }

  return guide.sections[String(sectionPath || '')] || null
}
