import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret_key_pentru_dev";

// Middleware pentru verificarea token-ului
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token lipsă. Autentificare necesară." });
  }

  const token = authHeader.substring(7); // Remove "Bearer "

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid sau expirat" });
  }
}

// Middleware pentru verificarea rolului de Profesor
export function requireProfessor(req, res, next) {
  if (!req.user || req.user.role !== "PROFESSOR") {
    return res.status(403).json({ message: "Acces interzis. Doar profesorii pot accesa această resursă." });
  }
  next();
}

// Middleware pentru verificarea rolului de Student
export function requireStudent(req, res, next) {
  if (!req.user || req.user.role !== "STUDENT") {
    return res.status(403).json({ message: "Acces interzis. Doar studenții pot accesa această resursă." });
  }
  next();
}

// Funcție pentru generarea token-ului
export function generateToken(user) {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
}
