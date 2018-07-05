import { getConfig, setConfig } from '~/utils/config'

const handleKeyPress = e => {
  if (e.altKey && e.ctrlKey && e.code === 'KeyP') {
    getConfig(({ hidePointBadge, hidePointSummary, ...rest }) => {
      if (hidePointBadge !== hidePointSummary) {
        setConfig({
          hidePointBadge: true,
          hidePointSummary: true,
          ...rest,
        })
      } else {
        setConfig({
          hidePointBadge: !hidePointBadge,
          hidePointSummary: !hidePointSummary,
          ...rest,
        })
      }
    })
  }
}

export const registerKeyboardEvents = () => {
  window.addEventListener('keypress', handleKeyPress)
}

export const removeKeyboardEvents = () => {
  window.removeEventListener('keypress', handleKeyPress)
}
