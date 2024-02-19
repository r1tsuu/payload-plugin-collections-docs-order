export interface PluginCollectionConfig {
  slug: string
}

export interface PluginOptions {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean
  collections: PluginCollectionConfig[]
}
