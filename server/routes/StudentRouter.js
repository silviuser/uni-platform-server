import express from "express";
import { createStudent, getStudents, getStudentById, getStudentByEmail, updateStudent } from "../dataAccess/StudentDA.js";
import bcrypt from "bcryptjs";
import { authenticate, requireStudent, generateToken } from "../middleware/auth.js";

const router = express.Router();

function toPublicStudent(s) {
	if (!s) return null;
	const { id, email, fullName, faculty, specialization, group, createdAt } = s;
	return { id, email, fullName, faculty, specialization, group, createdAt };
}

router.post("/", async (req, res) => {
	try {
		const { email, password, fullName, faculty, specialization, group } = req.body;
		if (!email || !password || !fullName || !faculty || !specialization || !group) {
			return res.status(400).json({ message: "email, password, fullName, faculty, specialization, group sunt obligatorii" });
		}

		const existing = await getStudentByEmail(email);
		if (existing) {
			return res.status(409).json({ message: "Email deja folosit" });
		}

		const hash = bcrypt.hashSync(password, 10);
		const created = await createStudent({ email, password: hash, fullName, faculty, specialization, group });
		return res.status(201).json(toPublicStudent(created));
	} catch (err) {
		return res.status(500).json({ message: "Eroare la creare student", error: err.message });
	}
});

router.get("/", async (_req, res) => {
	try {
		const list = await getStudents();
		return res.json(list.map(toPublicStudent));
	} catch (err) {
		return res.status(500).json({ message: "Eroare la listare studenti", error: err.message });
	}
});

router.get("/by-email", async (req, res) => {
	try {
		const { email } = req.query;
		if (!email) return res.status(400).json({ message: "Parametrul email este necesar" });
		const s = await getStudentByEmail(String(email));
		if (!s) return res.status(404).json({ message: "Student inexistent" });
		return res.json(toPublicStudent(s));
	} catch (err) {
		return res.status(500).json({ message: "Eroare la cautare dupa email", error: err.message });
	}
});

router.get("/:id", async (req, res) => {
	try {
		const s = await getStudentById(req.params.id);
		if (!s) return res.status(404).json({ message: "Student inexistent" });
		return res.json(toPublicStudent(s));
	} catch (err) {
		return res.status(500).json({ message: "Eroare la obtinere student", error: err.message });
	}
});

// Update student profile (self-service)
router.put("/:id", authenticate, requireStudent, async (req, res) => {
	try {
		const id = req.params.id;
		// Ensure student updates only own profile
		if (req.user.id !== id) {
			return res.status(403).json({ message: "Nu poți edita profilul altui student" });
		}

		const { fullName, faculty, specialization, group } = req.body;
		// Basic validation
		const payload = {};
		if (typeof fullName === "string" && fullName.trim()) payload.fullName = fullName.trim();
		if (typeof faculty === "string" && faculty.trim()) payload.faculty = faculty.trim();
		if (typeof specialization === "string" && specialization.trim()) payload.specialization = specialization.trim();
		if (typeof group === "string" && group.trim()) payload.group = group.trim();

		const updated = await updateStudent(id, payload);
		if (!updated) return res.status(404).json({ message: "Student inexistent" });
		return res.json(toPublicStudent(updated));
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

		const student = await getStudentByEmail(email);
		if (!student) {
			return res.status(401).json({ message: "Email sau parolă incorectă" });
		}

		const isValidPassword = bcrypt.compareSync(password, student.password);
		if (!isValidPassword) {
			return res.status(401).json({ message: "Email sau parolă incorectă" });
		}

		const token = generateToken({ 
			id: student.id, 
			email: student.email, 
			role: "STUDENT" 
		});

		return res.json({ 
			token, 
			role: "STUDENT",
			user: toPublicStudent(student) 
		});
	} catch (err) {
		return res.status(500).json({ message: "Eroare la autentificare", error: err.message });
	}
});

export default router;
