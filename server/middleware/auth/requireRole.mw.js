import { AppError } from "../../utils/AppError.js";

//requires "requireAuth.mw" to be used beforehand
//allowedRoles must be []
export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Action not allowed for this role", 403);
    }

    next();
  };
}
