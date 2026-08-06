export function errorMiddleware(err, req, res, next) {
  console.error(err); // always log server-side, even if you hide details from the client

  // Your own custom errors (see below)
  if (err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Fallback — never leak stack traces or internals to the client
  return res.status(500).json({ error: "internal server error" });
}
