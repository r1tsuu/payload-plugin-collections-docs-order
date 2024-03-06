# Payload Plugin Collections Docs Order

## About
Adds an option to re-order collection documents with drag n drop. Then on your front end you can query documents with applied sort by `docOrder` field. 

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



