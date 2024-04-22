import React, { useEffect, useState } from "react";

import { useConfig } from "@payloadcms/ui/providers/Config";
import { PaginatedDocs } from "payload/database";
import { Button } from "@payloadcms/ui/elements";
import { DraggableSortable } from "@payloadcms/ui/elements/DraggableSortable";
import { DraggableSortableItem } from "@payloadcms/ui/elements/DraggableSortable/DraggableSortableItem";
import { DragHandle } from "@payloadcms/ui/icons/DragHandle";
import { useTranslation } from "@payloadcms/ui/providers/Translation";
import { Radio } from "@payloadcms/ui/fields/RadioGroup/Radio";

import "react-toastify/dist/ReactToastify.css";
import { Dialog } from "../Dialog";

interface Doc extends Record<string, unknown> {
  id: number | string;
  docOrder: number;
  modifiedTo?: number;
  modifiedFrom?: number;
}

const CollectionDocsOrderContent = () => {
  const { collections, routes } = useConfig();
  const { t } = useTranslation();
  const url = window.location.href;
  let result = url.match(/\/collections\/([^?]+)/);

  const slug = result?.[1];

  const limit = 25;

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [data, setData] = useState<{
    docs: Doc[];
    hasNextPage: boolean;
    isLoading: boolean;
    loadedPages: number;
    totalDocs: number;
  }>({
    docs: [],
    hasNextPage: false,
    isLoading: true,
    loadedPages: 0,
    totalDocs: 0,
  });

  const hasSave = data.docs.some(
    (doc) =>
      typeof doc.modifiedTo === "number" && doc.modifiedTo !== doc.docOrder
  );

  const sort = `sort=${sortOrder === "desc" ? "-" : ""}docOrder`;

  const getInitalData = () => {
    return fetch(`/api/${slug}?${sort}&limit=${limit}`)
      .then((res) => res.json())
      .then(({ docs, hasNextPage, totalDocs }: PaginatedDocs<Doc>) =>
        setData({
          hasNextPage,
          isLoading: false,
          docs,
          loadedPages: 1,
          totalDocs,
        })
      );
  };

  useEffect(() => {
    if (slug) getInitalData();
  }, [sortOrder]);

  const collectionConfig = collections.find(
    (collection) => collection.slug === slug
  );

  if (!collectionConfig) return null;

  const useAsTitle = collectionConfig.admin.useAsTitle;

  const moveRow = (moveFromIndex: number, moveToIndex: number) => {
    setData((prev) => {
      const prevDocs = [...prev.docs];
      const newDocs = [...prev.docs];
      const [movedItem] = newDocs.splice(moveFromIndex, 1);
      newDocs.splice(moveToIndex, 0, movedItem);
      return {
        ...prev,
        docs: newDocs.map((doc, index) => {
          if (prevDocs[index].id !== doc.id) {
            return {
              ...doc,
              modifiedTo:
                prevDocs[index].modifiedTo ?? prevDocs[index].docOrder,
            };
          }
          return doc;
        }),
      };
    });
  };

  const save = async () => {
    const modifiedDocsData = data.docs
      .filter(
        (doc) =>
          typeof doc.modifiedTo === "number" && doc.modifiedTo !== doc.docOrder
      )
      .map((doc) => ({
        id: doc.id,
        modifiedTo: doc.modifiedTo,
      }));
    const { success } = await fetch(
      `${routes.api}/collection-docs-order/save`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collection: slug,
          docs: modifiedDocsData,
        }),
      }
    ).then((res) => res.json() as Promise<{ success: boolean }>);

    if (success) {
      setData((prev) => ({ ...prev, isLoading: true }));
      await getInitalData();
      // toast.success(t("pluginCollectionsDocsOrder:success"), {
      //   position: "bottom-center",
      // });
    } else {
    }
    // toast.error(t("pluginCollectionsDocsOrder:error"), {
    //   position: "bottom-center",
  };

  const loadMore = () => {
    setData((prev) => ({ ...prev, isLoading: true }));
    return fetch(
      `/api/${slug}?${sort}&limit=${limit}&page=${data.loadedPages + 1}`
    )
      .then((res) => res.json())
      .then(({ docs, hasNextPage }: PaginatedDocs<Doc>) =>
        setData((prev) => ({
          hasNextPage,
          isLoading: false,
          docs: [...prev.docs, ...docs],
          loadedPages: prev.loadedPages + 1,
          totalDocs: prev.totalDocs,
        }))
      );
  };

  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
    setData((prev) => ({ ...prev, isLoading: true }));
  };

  return (
    <div className="collection-docs-order-content">
      <div className="radio">
        <Radio
          path="asc"
          id="asc"
          onChange={() => handleSortOrderChange("asc")}
          isSelected={sortOrder === "asc"}
          option={{
            label: t("pluginCollectionsDocsOrder:asc"),
            value: "asc",
          }}
        />
        <Radio
          path="desc"
          id="desc"
          onChange={() => handleSortOrderChange("desc")}
          isSelected={sortOrder === "desc"}
          option={{
            label: t("pluginCollectionsDocsOrder:desc"),
            value: "desc",
          }}
        />
      </div>
      <DraggableSortable
        ids={data.docs.map((doc) => String(doc.id))}
        onDragEnd={({ moveFromIndex, moveToIndex }) =>
          moveRow(moveFromIndex, moveToIndex)
        }
        className="order-list"
      >
        {data.docs.map((doc, index) => (
          <DraggableSortableItem
            disabled={false}
            id={String(doc.id)}
            key={doc.id}
          >
            {(props) => {
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
                  <a
                    href={`${routes.admin}/collections/${slug}/${doc.id}`}
                    target="_blank"
                  >
                    {doc.docOrder}
                    {doc.modifiedTo &&
                      doc.modifiedTo !== doc.docOrder &&
                      ` - ${doc.modifiedTo}`}
                    {" - "}
                    {doc[useAsTitle] as string}
                  </a>
                </div>
              );
            }}
          </DraggableSortableItem>
        ))}
      </DraggableSortable>
      <div className="order-buttons">
        {data.isLoading
          ? "Loading"
          : `${t("loaded")} ${data.docs.length}/${data.totalDocs}`}
        {hasSave && <Button onClick={() => save()}>{t("save")}</Button>}
        {data.hasNextPage && (
          <Button onClick={loadMore}>{t("loadMore")}</Button>
        )}
      </div>
    </div>
  );
};

export const CollectionDocsOrderButton = () => {
  const { t } = useTranslation();
  return (
    <div className="gutter--left gutter--right collection-docs-order">
      <Dialog
        trigger={
          <button style={{ margin: 0 }}>
            {t("pluginCollectionsDocsOrder:sortItems")}
          </button>
        }
      >
        <CollectionDocsOrderContent />
        {/* <ToastContainer /> */}
      </Dialog>
    </div>
  );
};
