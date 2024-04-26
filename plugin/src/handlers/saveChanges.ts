import type { PayloadHandler } from 'payload/config';
import { Forbidden } from 'payload/errors';
import { z } from 'zod';

import type { PluginOptions } from '../types';

export const schema = z.object({
  collection: z.string(),
  docs: z.array(
    z.object({
      id: z.number().or(z.string()),
      modifiedTo: z.number(),
    }),
  ),
});

export const saveChanges =
  ({ access }: { access: NonNullable<PluginOptions['access']> }): PayloadHandler =>
  async (req) => {
    const result = schema.safeParse(await req.json());

    if (!result.success) return Response.json({ errors: result.error.errors }, { status: 400 });

    const allowed = await access({ data: result.data, req });

    if (!allowed) throw new Forbidden();

    const {
      data: { collection, docs },
    } = result;

    await Promise.all(
      docs.map((doc) => {
        req.payload.update({
          collection,
          data: {
            docOrder: doc.modifiedTo,
          },
          id: doc.id,
          req,
        });
      }),
    );

    return Response.json({ success: true });
  };
