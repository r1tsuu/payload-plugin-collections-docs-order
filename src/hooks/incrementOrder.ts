import {
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
} from "payload/types";

export const incrementOrder: CollectionBeforeValidateHook = async ({
  req,
  operation,
  collection,
  data,
}) => {
  if (!data || operation === "update") return;
  const {
    docs: [lastByOrder],
  } = await req.payload.find({
    collection: collection.slug,
    req,
    sort: "-docOrder",
  });

  if (!lastByOrder?.docOrder && typeof lastByOrder.docOrder === "number")
    data.docOrder = lastByOrder.docOrder + 1;

  data.docOrder = 1;
};
