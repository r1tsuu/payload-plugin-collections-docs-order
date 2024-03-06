import { CollectionConfig } from 'payload/types'
import { useTranslation } from 'react-i18next'

// Example Collection - For reference only, this must be added to payload.config.ts to be used.
const Examples: CollectionConfig = {
  slug: 'examples',
  admin: {
    useAsTitle: 'someField',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'someField',
      type: 'text',
    },
    {
      name: 'x',
      type: 'ui',
      admin: {
        components: {
          Field: () => {
            const { i18n } = useTranslation()
            console.log(i18n)
            return ''
          },
        },
      },
    },
  ],
}

export default Examples
