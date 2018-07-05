export default interface IConfig {
  hidePointBadge: boolean
  hidePointSummary: boolean
}

export type ConfigKeys = keyof IConfig
export type ConfigValues = IConfig[keyof IConfig]
