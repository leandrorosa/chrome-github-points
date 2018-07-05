import IConfig, { ConfigKeys, ConfigValues } from '~/types/IConfig'

declare var chrome: any

export const getConfig = cb => {
  chrome.storage.sync.get(
    ['hidePointBadge', 'hidePointSummary'],
    (config: IConfig) => cb(config)
  )
}

export const setConfigItem = (
  key: ConfigKeys,
  value: ConfigValues,
  cb = () => {}
) => {
  chrome.storage.sync.set({ [key]: value }, cb)
}

export const setConfig = (config: IConfig, cb = () => {}) => {
  chrome.storage.sync.set(config, cb)
}

export const addConfigChangeListener = cb => {
  chrome.storage.onChanged.addListener(cb)
}

export const removeConfigChangeListener = cb => {
  chrome.storage.onChanged.removeListener(cb)
}
