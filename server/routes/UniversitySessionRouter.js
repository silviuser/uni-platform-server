import express from "express";
import { createUniversitySession, getUniversitySessions } from "../dataAccess/UniversitySessionDA.js";

const router = express.Router();

// GET /api/university-sessions - Pentru a popula dropdown-ul din UI
router.get("/", async (req, res) => {
    try {
        const sessions = await getUniversitySessions();
        return res.json(sessions);
    } catch (err) {
        return res.status(500).json({ message: "Eroare server", error: err.message });
    }
});

// POST /api/university-sessions - Pentru admin (sau populare inițială)
router.post("/", async (req, res) => {
    try {
        const session = await createUniversitySession(req.body);
        return res.status(201).json(session);
    } catch (err) {
        return res.status(500).json({ message: "Eroare creare", error: err.message });
    }
});

export default router;