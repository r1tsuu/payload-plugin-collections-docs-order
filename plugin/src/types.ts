import type { PayloadRequest } from 'payload/types';

import type { SaveChangesArgs } from './handlers/types';

export type PluginCollectionConfig = {
  slug: string;
};

export type PluginOptions = {
  access?: (args: { data: SaveChangesArgs; req: PayloadRequest }) => Promise<boolean> | boolean;
  collections: PluginCollectionConfig[];
  /**
   * Enable or disable the plugin
   * @default false
   */
  enabled?: boolean;
};
