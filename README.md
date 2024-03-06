# Payload Plugin Collections Docs Order

## About
Adds an option to re-order collection documents with drag n drop (almost like array/blocks items). Then on your front end you can query documents with applied sort by `docOrder` field.

## Video
https://github.com/r1tsuu/payload-plugin-collections-docs-order/assets/64744993/2c13cdd9-f809-4c40-82c6-0b6f78997f74

## Install
`yarn add @r1tsu/payload-plugin-collections-docs-order`
In your payload.config.ts:
```ts
/// ....
import { collectionsDocsOrderPlugin } from '@r1tsu/payload-plugin-collections-docs-order'

// Import styles
import '@r1tsu/payload-plugin-collections-docs-order/dist/styles.scss'

export default buildConfig({
  // ...
  // The feature will be enabled only for collections that are in this array.
  plugins: [collectionsDocsOrderPlugin({ collections: [{ slug: 'pages' }] })],
})

```

## Querying with applied plugin's sort.
REST:
```ts
fetch("http://localhost:3000/api/examples?sort=docOrder").then((res) => res.json())
```
Local API:
```ts
payload.find({ collection: "examples", sort: "docOrder" })
```
GraphQL:
```graphql
query {
  Examples(sort: "docOrder") {
    docs {
      title
    }
  }

```

## Script to setup for collections that had documents before installing the plugin (recommend to backup the database before)
1. Copy this file to your project's folder and update `collections` array with your needs. https://gist.github.com/r1tsuu/047008be9800dfcbe371247d10ee6794
2. Run the file like that: `yarn ts-node --project ./tsconfig.server.json pluginCollectionsDocsSetup.ts`
