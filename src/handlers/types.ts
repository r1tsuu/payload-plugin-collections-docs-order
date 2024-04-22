import { z } from "zod";
import { schema } from "./saveChanges";

export type SaveChangesArgs = z.infer<typeof schema>;

export type SaveChangesResult = {
  success: boolean;
};
