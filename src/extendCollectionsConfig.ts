import type { CollectionConfig } from 'payload/types'
import { PluginOptions } from './types'
import type { Payload } from 'payload'
import { CollectionDocsOrderButton } from './components/CollectionDocsOrder'

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
    defaultSort: collection.defaultSort ?? '-docOrder',
    fields: [
      ...collection.fields,
      {
        type: 'number',
        name: 'docOrder',
        index: true,
        access: {
          read: () => true,
          create: () => false,
          update: () => false,
        },
      },
    ],
    hooks: {
      beforeChange: [
        ...(collection.hooks?.beforeChange ?? []),
        async ({ req, operation, data }) => {
          if (operation === 'update') return
          const payload = req.payload as Payload
          const {
            docs: [lastDocByOrder],
          } = await payload.find({ collection: collection.slug, sort: '-docOrder' })
          if (lastDocByOrder && typeof lastDocByOrder.docOrder === 'number') {
            data.docOrder = lastDocByOrder.docOrder + 1
          } else data.docOrder = 1
        },
      ],
    },
  } as CollectionConfig
}

export const extendCollectionsConfig = (
  incomingCollections: CollectionConfig[],
  { collections }: PluginOptions,
) => {
  return incomingCollections.map(collection => {
    const foundInConfig = collections.some(({ slug }) => slug === collection.slug)
    if (!foundInConfig) return collection

    return externdCollectionConfig(collection)
  })
}
