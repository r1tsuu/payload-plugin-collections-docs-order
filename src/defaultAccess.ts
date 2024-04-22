import { PayloadRequest } from "payload/types";
import { z } from "zod";
import { SaveChangesArgs } from "./handlers/types";

export const defaultAccess = ({
  req,
}: {
  req: PayloadRequest;
  data: SaveChangesArgs;
}) => {
  return !!req.user;
};
