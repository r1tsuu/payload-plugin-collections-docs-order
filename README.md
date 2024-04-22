# Payload Plugin Collections Docs Order

Warning: this is a beta version for Payload 3.0-beta

## About

Adds an option to re-order collection documents with drag n drop (almost like array/blocks items). Then on your front end you can query documents with applied sort by `docOrder` field.

## Video

https://github.com/r1tsuu/payload-plugin-collections-docs-order/assets/64744993/2c13cdd9-f809-4c40-82c6-0b6f78997f74

## Install

`pnpm add @r1tsu/payload-plugin-collections-docs-order@1.0.0-beta.4`
In your payload.config.ts:

```ts
/// ....
import { collectionsDocsOrderPlugin } from '@r1tsu/payload-plugin-collections-docs-order';

// Import styles
import '@r1tsu/payload-plugin-collections-docs-order/dist/styles.scss';

export default buildConfig({
  // ...
  plugins: [
    collectionsDocsOrderPlugin({
      collections: [{ slug: 'pages' }], // The feature will be enabled only for collections that are in this array.,
      defaultSortByDocOrder: true, // Optional, if you want to use `docOrder` field for default sort in the selected collections, default - `false`,
      access: ({ req, data }) => {
        // Optional, configure access to `saveChanges` endpoint
        return req.user?.collection === 'admins';
      },
    }),
  ],
});
```

## Querying with applied plugin's sort.

REST:

```ts
fetch('http://localhost:3000/api/examples?sort=docOrder').then((res) => res.json());
```

Local API:

```ts
payload.find({ collection: 'examples', sort: 'docOrder' });
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

## Script to setup for collections that had documents before installing the plugin

1. Create folder named cli in your project's root
2. Copy this file to the created folder and update `collections` array with your needs. https://gist.github.com/r1tsuu/047008be9800dfcbe371247d10ee6794
3. Run the file like that: `yarn ts-node --project ./tsconfig.server.json ./cli/pluginCollectionsDocsSetup.ts` (It will run for a database that in your .env, also be sure to backup if this on production)
