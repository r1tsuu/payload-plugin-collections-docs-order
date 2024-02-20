import payload from 'payload'

require('dotenv').config()

const collections = ['examples']

const initPluginForExistingDocs = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    local: true,
  })

  payload.logger.info('Starting...')

  for (const slug of collections) {
    const { docs } = await payload.find({ collection: slug, pagination: false, sort: 'createdAt' })
    await Promise.all(
      docs.map(async (doc, index) => {
        await payload.update({ collection: slug, id: doc.id, data: { docOrder: index + 1 } })
      }),
    )
  }

  payload.logger.info('Successfully inited')
  process.exit(0)
}

initPluginForExistingDocs()
