import type { Plugin } from "payload/config";

import type { PluginOptions } from "./types";
import { extendCollectionsConfig } from "./extendCollectionsConfig";
import { deepMerge } from "payload/utilities";
import { translations } from "./translations";
import { saveChanges } from "./handlers/saveChanges";
import { defaultAccess } from "./defaultAccess";

export const collectionsDocsOrderPlugin =
  (pluginOptions: PluginOptions): Plugin =>
  (config) => {
    if (pluginOptions.enabled === false) {
      return config;
    }

    if (config.collections) {
      config.collections = extendCollectionsConfig(
        config.collections,
        pluginOptions
      );
    }

    config.endpoints = [
      ...(config.endpoints || []),
      {
        path: "/collection-docs-order/save",
        method: "post",
        handler: saveChanges({ access: pluginOptions.access ?? defaultAccess }),
      },
    ];

    config.i18n = {
      ...config.i18n,
      translations: {
        ...deepMerge(translations, config.i18n?.translations),
      },
    };

    return config;
  };
