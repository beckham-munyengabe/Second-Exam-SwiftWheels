import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch { return res.status(401).json({ message: "Invalid token" }); }
};
export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "administrator") return res.status(403).json({ message: "Admin only" });
  next();
};
