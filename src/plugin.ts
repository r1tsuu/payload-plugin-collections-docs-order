import type { Plugin } from 'payload/config'

import { onInitExtension } from './onInitExtension'
import type { PluginOptions } from './types'
import { extendWebpackConfig } from './webpack'
import { extendCollectionsConfig } from './extendCollectionsConfig'
import { saveEndpoint } from './saveEndpoint'
import { deepMerge } from 'payload/utilities'
import { translations } from './translations'

export const collectionsDocsOrderPlugin =
  (pluginOptions: PluginOptions): Plugin =>
  incomingConfig => {
    let config = { ...incomingConfig }

    // If you need to add a webpack alias, use this function to extend the webpack config
    const webpack = extendWebpackConfig(incomingConfig)

    config.admin = {
      ...(config.admin || {}),
      // If you extended the webpack config, add it back in here
      // If you did not extend the webpack config, you can remove this line
      webpack,

      // Add additional admin config here
    }

    // If the plugin is disabled, return the config without modifying it
    // The order of this check is important, we still want any webpack extensions to be applied even if the plugin is disabled
    if (pluginOptions.enabled === false) {
      return config
    }

    if (config.collections) {
      config.collections = extendCollectionsConfig(config.collections, pluginOptions)
    }

    config.endpoints = [
      ...(config.endpoints || []),
      {
        path: '/collection-docs-order/save',
        method: 'post',
        handler: saveEndpoint,
      },
      // Add additional endpoints here
    ]

    config.i18n = {
      ...config.i18n,
      resources: {
        ...deepMerge(translations, config.i18n?.resources),
      },
    }

    config.onInit = async payload => {
      if (incomingConfig.onInit) await incomingConfig.onInit(payload)
      // Add additional onInit code by using the onInitExtension function
      onInitExtension(pluginOptions, payload)
    }

    return config
  }
