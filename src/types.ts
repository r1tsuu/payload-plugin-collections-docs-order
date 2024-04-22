import { PayloadRequest } from "payload/types";
import { SaveChangesArgs } from "./handlers/types";

export interface PluginCollectionConfig {
  slug: string;
}

export interface PluginOptions {
  /**
   * Enable or disable the plugin
   * @default false
   */
  enabled?: boolean;
  collections: PluginCollectionConfig[];
  access?: (args: {
    req: PayloadRequest;
    data: SaveChangesArgs;
  }) => Promise<boolean> | boolean;
}
