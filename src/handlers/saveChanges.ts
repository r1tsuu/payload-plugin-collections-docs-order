import { PayloadHandler } from "payload/config";
import { AuthenticationError } from "payload/errors";
import { z } from "zod";
import { PluginOptions } from "../types";

export const schema = z.object({
  collection: z.string(),
  docs: z.array(
    z.object({
      id: z.number().or(z.string()),
      modifiedTo: z.number(),
    })
  ),
});

export const saveChanges =
  ({
    access,
  }: {
    access: NonNullable<PluginOptions["access"]>;
  }): PayloadHandler =>
  async (req) => {
    const result = schema.safeParse(req.data);
    if (!result.success)
      return Response.json({ errors: result.error.errors }, { status: 400 });

    const allowed = await access({ req, data: result.data });
    if (!allowed) throw new AuthenticationError();

    const {
      data: { collection, docs },
    } = result;

    await Promise.all(
      docs.map(async (doc) => {
        req.payload.update({
          req,
          collection,
          id: doc.id,
          data: {
            modifiedTo: doc.modifiedTo,
          },
        });
      })
    );

    return Response.json({ success: true });
  };
