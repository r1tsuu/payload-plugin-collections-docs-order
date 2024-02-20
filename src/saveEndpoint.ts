import { PayloadHandler } from 'payload/config'

import * as Joi from 'joi'
import type { Payload } from 'payload'

const schema = Joi.object({
  docs: Joi.array()
    .items(
      Joi.object({
        id: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
        modifiedTo: Joi.number().required(),
      }),
    )
    .required(),
  collection: Joi.string().required(),
})

export const saveEndpoint: PayloadHandler = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Unathorized' })
  const result = schema.validate(req.body)
  if (result.error) return res.status(400).json({ message: result.error.message })

  const value = result.value.docs as {
    id: number | string
    modifiedTo: number
  }[]

  const payload = req.payload as Payload
  let transaction: string | number | null = null
  if (payload.db.beginTransaction) {
    transaction = await payload.db.beginTransaction()
  }

  try {
    await Promise.all(
      value.map(async ({ id, modifiedTo }) => {
        payload.update({
          collection: result.value.collection as string,
          id,
          data: {
            docOrder: modifiedTo,
          },
        })
      }),
    )
  } catch {
    if (payload.db.rollbackTransaction && transaction !== null) {
      await payload.db.rollbackTransaction(transaction)
    }
    return res.json({ success: false })
  }

  if (payload.db.commitTransaction && transaction !== null) {
    await payload.db.commitTransaction(transaction)
  }

  res.json({ success: true })
}
