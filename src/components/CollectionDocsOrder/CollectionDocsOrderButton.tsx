import React, { useEffect, useState } from 'react'

import { useParams, useLocation, useHistory } from 'react-router'
import { useConfig } from 'payload/dist/admin/components/utilities/Config'
import DefaultTemplate from 'payload/dist/admin/components/templates/Default'
import { PaginatedDocs } from 'payload/dist/database/types'
import { useInView } from 'react-intersection-observer'
import { Button } from 'payload/components'
import DraggableSortable from 'payload/dist/admin/components/elements/DraggableSortable'
import DraggableSortableItem from 'payload/dist/admin/components/elements/DraggableSortable/DraggableSortableItem'
import DragHandle from 'payload/dist/admin/components/icons/Drag'
import { toast, ToastContainer } from 'react-toastify'

import { TypeWithID } from 'payload/types'

import RadioInput from 'payload/dist/admin/components/forms/field-types/RadioGroup/Input'

import './CollectionDocsOrderPage.scss'
import 'react-toastify/dist/ReactToastify.css'
import { Dialog } from '../Dialog'

interface Doc extends Record<string, unknown> {
  id: number | string
  docOrder: number
  modifiedTo?: number
  modifiedFrom?: number
}

const CollectionDocsOrderContent = () => {
  const { collections, routes } = useConfig()

  const url = window.location.href
  let result = url.match(/\/collections\/([^?]+)/)

  const slug = result?.[1]

  const limit = 25

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [data, setData] = useState<{
    docs: Doc[]
    hasNextPage: boolean
    isLoading: boolean
    loadedPages: number
    totalDocs: number
  }>({
    docs: [],
    hasNextPage: false,
    isLoading: true,
    loadedPages: 0,
    totalDocs: 0,
  })

  const hasSave = data.docs.some(
    doc => typeof doc.modifiedTo === 'number' && doc.modifiedTo !== doc.docOrder,
  )

  const getInitalData = () => {
    return fetch(`/api/${slug}?sort=${sortOrder === 'desc' ? '-' : ''}docOrder&limit=${limit}`)
      .then(res => res.json())
      .then(({ docs, hasNextPage, totalDocs }: PaginatedDocs<Doc>) =>
        setData({
          hasNextPage,
          isLoading: false,
          docs,
          loadedPages: 1,
          totalDocs,
        }),
      )
  }

  useEffect(() => {
    if (slug) getInitalData()
  }, [])

  const collectionConfig = collections.find(collection => collection.slug === slug)

  if (!collectionConfig) return null

  const useAsTitle = collectionConfig.admin.useAsTitle

  const moveRow = (moveFromIndex: number, moveToIndex: number) => {
    setData(prev => ({
      ...prev,
      docs: prev.docs.map((doc, index) => {
        if (index === moveFromIndex)
          return {
            ...prev.docs[moveToIndex],
            modifiedTo: prev.docs[moveFromIndex].modifiedTo ?? prev.docs[moveFromIndex].docOrder,
          }
        if (index === moveToIndex)
          return {
            ...prev.docs[moveFromIndex],
            modifiedTo: prev.docs[moveToIndex].modifiedTo ?? prev.docs[moveToIndex].docOrder,
          }
        return doc
      }),
    }))
  }

  const save = async () => {
    const modifiedDocsData = data.docs
      .filter(doc => typeof doc.modifiedTo === 'number' && doc.modifiedTo !== doc.docOrder)
      .map(doc => ({
        id: doc.id,
        modifiedTo: doc.modifiedTo,
      }))
    const { success } = await fetch(`${routes.api}/collection-docs-order/save`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collection: slug,
        docs: modifiedDocsData,
      }),
    }).then(res => res.json() as Promise<{ success: boolean }>)

    if (success) {
      setData(prev => ({ ...prev, isLoading: true }))
      await getInitalData()
      toast.success('Successfully modified', { position: 'bottom-center' })
    } else toast.error('Unknown server error', { position: 'bottom-center' })
  }

  const loadMore = () => {
    setData(prev => ({ ...prev, isLoading: true }))
    return fetch(`/api/${slug}?sort=-docOrder&limit=${limit}&page=${data.loadedPages + 1}`)
      .then(res => res.json())
      .then(({ docs, hasNextPage }: PaginatedDocs<Doc>) =>
        setData(prev => ({
          hasNextPage,
          isLoading: false,
          docs: [...prev.docs, ...docs],
          loadedPages: prev.loadedPages + 1,
          totalDocs: prev.totalDocs,
        })),
      )
  }

  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    setSortOrder(order)
    setData(prev => ({ ...prev, isLoading: true }))
    getInitalData()
  }

  return (
    <div className="collection-docs-order-content">
      <RadioInput
        label="Sort order"
        name="sortOrder"
        onChange={value => handleSortOrderChange(value as 'asc' | 'desc')}
        options={[
          {
            label: 'Descending',
            value: 'desc',
          },
          {
            label: 'Asceding',
            value: 'asc',
          },
        ]}
        value={sortOrder}
      />
      <DraggableSortable
        ids={data.docs.map(doc => String(doc.id))}
        onDragEnd={({ moveFromIndex, moveToIndex }) => moveRow(moveFromIndex, moveToIndex)}
        className="order-list"
      >
        {data.docs.map((doc, index) => (
          <DraggableSortableItem disabled={false} id={String(doc.id)} key={doc.id}>
            {props => {
              return (
                <div
                  style={{ transform: props.transform }}
                  ref={props.setNodeRef}
                  className="order-item"
                >
                  <div
                    {...props.attributes}
                    {...props.listeners}
                    role="button"
                    className="order-drag"
                  >
                    <DragHandle />
                  </div>
                  <a href={`${routes.admin}/collections/${slug}/${doc.id}`} target="_blank">
                    {doc.docOrder}
                    {doc.modifiedTo &&
                      doc.modifiedTo !== doc.docOrder &&
                      ` - ${doc.modifiedTo}`}{' '}
                    {doc[useAsTitle] as string}
                  </a>
                </div>
              )
            }}
          </DraggableSortableItem>
        ))}
      </DraggableSortable>
      <div className="order-buttons">
        {data.isLoading ? 'Loading' : `Loaded ${data.docs.length}/${data.totalDocs} docs`}
        {hasSave && <Button onClick={() => save()}>Save</Button>}
        {data.hasNextPage && <Button onClick={loadMore}>Load more</Button>}
      </div>
    </div>
  )
}

export const CollectionDocsOrderButton = () => {
  return (
    <div className="gutter--left gutter--right collection-docs-order">
      <Dialog trigger={<button>Sort documents</button>}>
        <CollectionDocsOrderContent />
        <ToastContainer />
      </Dialog>
    </div>
  )
}
