import express from "express";
import bcrypt from "bcryptjs";
import { getProfessorByEmail } from "../dataAccess/ProfessorDA.js";
import { getStudentByEmail } from "../dataAccess/StudentDA.js";
import { generateToken } from "../middleware/auth.js";

const router = express.Router();

function toPublicProfessor(p) {
  if (!p) return null;
  const { id, email, fullName, department, createdAt } = p;
  return { id, email, fullName, department, createdAt };
}

function toPublicStudent(s) {
  if (!s) return null;
  const { id, email, fullName, faculty, specialization, group, createdAt } = s;
  return { id, email, fullName, faculty, specialization, group, createdAt };
}

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "email, password și role sunt obligatorii" });
    }

    if (role === "PROFESSOR") {
      const professor = await getProfessorByEmail(email);
      if (!professor) {
        return res.status(401).json({ message: "Email sau parolă incorectă" });
      }
      const isValidPassword = bcrypt.compareSync(password, professor.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Email sau parolă incorectă" });
      }
      const token = generateToken({ id: professor.id, email: professor.email, role: "PROFESSOR" });
      return res.json({ token, role: "PROFESSOR", user: toPublicProfessor(professor) });
    }

    if (role === "STUDENT") {
      const student = await getStudentByEmail(email);
      if (!student) {
        return res.status(401).json({ message: "Email sau parolă incorectă" });
      }
      const isValidPassword = bcrypt.compareSync(password, student.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Email sau parolă incorectă" });
      }
      const token = generateToken({ id: student.id, email: student.email, role: "STUDENT" });
      return res.json({ token, role: "STUDENT", user: toPublicStudent(student) });
    }

    return res.status(400).json({ message: "Rol invalid. Folosește PROFESSOR sau STUDENT" });
  } catch (err) {
    return res.status(500).json({ message: "Eroare la autentificare", error: err.message });
  }
});

export default router;
