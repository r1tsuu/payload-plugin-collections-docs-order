import React, { useEffect, useState } from 'react'

import { useParams, useLocation } from 'react-router'
import { useConfig } from 'payload/dist/admin/components/utilities/Config'
import DefaultTemplate from 'payload/dist/admin/components/templates/Default'
import { PaginatedDocs } from 'payload/dist/database/types'
import { useInView } from 'react-intersection-observer'
import { Button } from 'payload/components'

import { TypeWithID } from 'payload/types'

import './CollectionDocsOrderPage.scss'
import { Dialog } from '../Dialog'

interface Doc {
  id: number | string
  docOrder: number
}

const CollectionDocsOrderContent = () => {
  const { collections } = useConfig()

  const slug = 'examples'

  const [data, setData] = useState<{
    docs: Doc[]
    hasNextPage: boolean
    isLoading: boolean
  }>({
    docs: [],
    hasNextPage: false,
    isLoading: true,
  })

  useEffect(() => {
    fetch(`/api/${slug}?sort=-docOrder&limit=25`)
      .then(res => res.json())
      .then(({ docs, hasNextPage }: PaginatedDocs<Doc>) =>
        setData({
          hasNextPage,
          isLoading: false,
          docs,
        }),
      )
  }, [])

  const collectionConfig = collections.find(collection => collection.slug === slug)

  if (!collectionConfig) return null

  const useAsTitle = collectionConfig.admin.useAsTitle

  return (
    <div className="gutter--left gutter--right collection-docs-order">
      <Button>Order</Button>
    </div>
  )
}

const modalSlug = 'collection-docs-order'

export const CollectionDocsOrderButton = () => {
  return (
    <div className="gutter--left gutter--right collection-docs-order">
      <Dialog trigger={<button>Sort documents</button>}>
        <CollectionDocsOrderContent />
      </Dialog>
    </div>
  )
}
