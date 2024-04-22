import type { CollectionConfig } from "payload/types";
import { PluginOptions } from "./types";
import type { Payload } from "payload";
import { CollectionDocsOrderButton } from "./components/CollectionDocsOrder";
import { incrementOrder } from "./hooks/incrementOrder";

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
        type: "number",
        name: "docOrder",
        index: true,
        access: {
          read: () => true,
          create: () => false,
          update: () => false,
        },
      },
    ],
    hooks: {
      ...(collection.hooks ?? {}),
      beforeChange: [...(collection.hooks?.beforeChange ?? []), incrementOrder],
    },
  } as CollectionConfig;
};

export const extendCollectionsConfig = (
  incomingCollections: CollectionConfig[],
  { collections }: PluginOptions
) => {
  return incomingCollections.map((collection) => {
    const foundInConfig = collections.some(
      ({ slug }) => slug === collection.slug
    );
    if (!foundInConfig) return collection;

    return externdCollectionConfig(collection);
  });
};
