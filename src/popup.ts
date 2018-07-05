import { registerKeyboardEvents } from '~/registerKeyboardEvents'
import IConfig from '~/types/IConfig'
import IHTMLElementEvent from '~/types/IHTMLElementEvent'
import {
  addConfigChangeListener,
  getConfig,
  setConfigItem,
} from '~/utils/config'

const $hidePointBadge = document.getElementById(
  'hide_point_badges'
) as HTMLInputElement

const $hidePointSummary = document.getElementById(
  'hide_point_summary'
) as HTMLInputElement

getConfig(({ hidePointBadge = false, hidePointSummary = false }: IConfig) => {
  $hidePointBadge.checked = hidePointBadge
  $hidePointSummary.checked = hidePointSummary

  $hidePointBadge.addEventListener(
    'change',
    (e: IHTMLElementEvent<HTMLInputElement>) => {
      setConfigItem('hidePointBadge', e.target.checked)
    }
  )

  $hidePointSummary.addEventListener(
    'change',
    (e: IHTMLElementEvent<HTMLInputElement>) => {
      setConfigItem('hidePointSummary', e.target.checked)
    }
  )
})

addConfigChangeListener(({ hidePointBadge, hidePointSummary }) => {
  if (hidePointBadge) {
    $hidePointBadge.checked = hidePointBadge.newValue
  }

  if (hidePointSummary) {
    $hidePointSummary.checked = hidePointSummary.newValue
  }
})

registerKeyboardEvents()
