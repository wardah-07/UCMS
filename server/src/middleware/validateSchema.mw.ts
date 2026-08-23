import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "../utils/AppError.js";

function validateSchema(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      throw new AppError(
        result.error.issues[0].message || "schema validation error",
        400,
      );
    }

    req.body = result.data; // overwrite with the validated (and trimmed/normalized) data
    next();
  };
}

export default validateSchema;
