import express from "express";
import { createProfessor, getProfessors, getProfessorById, getProfessorByEmail, updateProfessor } from "../dataAccess/ProfessorDA.js";
import bcrypt from "bcryptjs";
import { generateToken, authenticate, requireProfessor } from "../middleware/auth.js";

const router = express.Router();

function toPublicProfessor(p) {
  if (!p) return null;
  const { id, email, fullName, department, createdAt } = p;
  return { id, email, fullName, department, createdAt };
}

router.post("/", async (req, res) => {
  try {
    const { email, password, fullName, department } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "email, password, fullName sunt obligatorii" });
    }

    const existing = await getProfessorByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email deja folosit" });
    }

    const hash = bcrypt.hashSync(password, 10);
    const created = await createProfessor({ email, password: hash, fullName, department });
    return res.status(201).json(toPublicProfessor(created));
  } catch (err) {
    return res.status(500).json({ message: "Eroare la creare profesor", error: err.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const list = await getProfessors();
    return res.json(list.map(toPublicProfessor));
  } catch (err) {
    return res.status(500).json({ message: "Eroare la listare profesori", error: err.message });
  }
});

router.get("/by-email", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Parametrul email este necesar" });
    const p = await getProfessorByEmail(String(email));
    if (!p) return res.status(404).json({ message: "Profesor inexistent" });
    return res.json(toPublicProfessor(p));
  } catch (err) {
    return res.status(500).json({ message: "Eroare la cautare dupa email", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const p = await getProfessorById(req.params.id);
    if (!p) return res.status(404).json({ message: "Profesor inexistent" });
    return res.json(toPublicProfessor(p));
  } catch (err) {
    return res.status(500).json({ message: "Eroare la obtinere profesor", error: err.message });
  }
});

router.put("/:id", authenticate, requireProfessor, async (req, res) => {
  try {
    if (req.params.id !== req.user.id) {
      return res.status(403).json({ message: "Nu poți actualiza profil pentru alți profesori" });
    }

    const updated = await updateProfessor(req.params.id, {
      fullName: req.body.fullName,
      department: req.body.department
    });

    if (!updated) {
      return res.status(404).json({ message: "Profesor inexistent" });
    }

    return res.json(toPublicProfessor(updated));
  } catch (err) {
    return res.status(500).json({ message: "Eroare la actualizare profil", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email și password sunt obligatorii" });
    }

    const professor = await getProfessorByEmail(email);
    if (!professor) {
      return res.status(401).json({ message: "Email sau parolă incorectă" });
    }

    const isValidPassword = bcrypt.compareSync(password, professor.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Email sau parolă incorectă" });
    }

    const token = generateToken({ 
      id: professor.id, 
      email: professor.email, 
      role: "PROFESSOR" 
    });

    return res.json({ 
      token, 
      role: "PROFESSOR",
      user: toPublicProfessor(professor) 
    });
  } catch (err) {
    return res.status(500).json({ message: "Eroare la autentificare", error: err.message });
  }
});

export default router;
