import type { CollectionConfig } from 'payload/types';

import { CollectionDocsOrderButton } from './components/CollectionDocsOrder';
import { incrementOrder } from './hooks/incrementOrder';
import type { PluginOptions } from './types';

const externdCollectionConfig = (collection: CollectionConfig) => {
  return {
    ...collection,
    admin: {
      ...(collection.admin ?? {}),
      components: {
        ...(collection.admin?.components ?? {}),
        BeforeList: [
          ...(collection.admin?.components?.BeforeList ?? []),
          CollectionDocsOrderButton,
        ],
      },
    },
    fields: [
      ...collection.fields,
      {
        access: {
          create: () => false,
          read: () => true,
          update: () => false,
        },
        index: true,
        name: 'docOrder',
        type: 'number',
      },
    ],
    hooks: {
      ...(collection.hooks ?? {}),
      beforeValidate: [...(collection.hooks?.beforeValidate ?? []), incrementOrder],
    },
  } as CollectionConfig;
};

export const extendCollectionsConfig = (
  incomingCollections: CollectionConfig[],
  { collections }: PluginOptions,
) => {
  return incomingCollections.map((collection) => {
    const foundInConfig = collections.some(({ slug }) => slug === collection.slug);

    if (!foundInConfig) return collection;

    return externdCollectionConfig(collection);
  });
};
