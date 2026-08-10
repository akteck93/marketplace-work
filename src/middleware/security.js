export function rejectMongoOperators(req, res, next) {
  function hasDangerousKey(value) {
    if (!value || typeof value !== "object") return false;

    for (const [key, child] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) return true;
      if (hasDangerousKey(child)) return true;
    }
    return false;
  }

  if (hasDangerousKey(req.body) || hasDangerousKey(req.query)) {
    return res.status(400).json({ success: false, message: "Invalid request payload." });
  }

  next();
}
