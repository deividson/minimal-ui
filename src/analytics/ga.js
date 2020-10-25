const GA_HITS = {
  SCREEN_VIEW: 'screen_view',
  PAGE_VIEW: 'page_view',
}

const sendGAEvent = (action, params) => {
  gtag && gtag('event', action, params)
}

const sendScreenView = (name) => {
  sendGAEvent(GA_HITS.SCREEN_VIEW, {
    screen_name: name,
  })
}

export {
  sendGAEvent,
  sendScreenView,
}
