import { AppError } from "../utils/AppError.js";

export function validateSchema(schema) {
  return (req, res, next) => {
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
