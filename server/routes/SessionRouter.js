import express from "express";
import {
  createSession,
  getSessions,
  getSessionById,
  getSessionsByProfessor,
  findOverlappingSessions,
  updateSession,
} from "../dataAccess/SessionDA.js";
import { authenticate, requireProfessor } from "../middleware/auth.js";

const router = express.Router();

async function toPublicSession(s) {
  if (!s) return null;
  
  // Convertim obiectul Sequelize la JSON pentru a accesa datele nested
  const sessionData = s.toJSON ? s.toJSON() : s;
  
  const { id, professorId, description, startTime, endTime, maxSpots, availableSpots, universitySessionId, professor, universitySession } = sessionData;
  
  return { 
    id, 
    professorId, 
    description, 
    startTime, 
    endTime, 
    maxSpots,
    availableSpots, 
    universitySessionId,
    professor: professor ? {
      id: professor.id,
      fullName: professor.fullName,
      department: professor.department
    } : null,
    universitySession: universitySession ? {
      id: universitySession.id,
      name: universitySession.name,
      academicYear: universitySession.academicYear,
      type: universitySession.type
    } : null
  };
}

router.post("/", authenticate, requireProfessor, async (req, res) => {
  try {
    const { professorId, description, startTime, endTime, maxSpots, universitySessionId } = req.body;

    if (!professorId || !startTime || !endTime || !maxSpots || !universitySessionId) {
      return res.status(400).json({ message: "professorId, startTime, endTime, maxSpots, universitySessionId sunt obligatorii" });
    }

    // Verifică dacă profesorul logat creează sesiune pentru el însuși
    if (professorId !== req.user.id) {
      return res.status(403).json({ message: "Nu poți crea sesiuni pentru alți profesori" });
    }
    

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (endDate <= startDate) {
      return res.status(400).json({ message: "endTime trebuie să fie după startTime" });
    }

    const overlaps = await findOverlappingSessions(professorId, startDate, endDate);
    if (overlaps && overlaps.length > 0) {
      return res.status(409).json({ message: "Sesiune suprapusă pentru acest profesor la intervalul dat" });
    }

    const created = await createSession({ 
      professorId, 
      description, 
      startTime: startDate, 
      endTime: endDate, 
      maxSpots, 
      availableSpots: maxSpots, // Initialize with maxSpots
      universitySessionId 
    });
    return res.status(201).json(await toPublicSession(created));
  } catch (err) {
    return res.status(500).json({ message: "Eroare la creare sesiune", error: err.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const list = await getSessions();
    const publicSessions = await Promise.all(list.map(s => toPublicSession(s)));
    return res.json(publicSessions);
  } catch (err) {
    return res.status(500).json({ message: "Eroare la listare sesiuni", error: err.message });
  }
});

router.get("/professor/:professorId", async (req, res) => {
  try {
    const list = await getSessionsByProfessor(req.params.professorId);
    const publicSessions = await Promise.all(list.map(s => toPublicSession(s)));
    return res.json(publicSessions);
  } catch (err) {
    return res.status(500).json({ message: "Eroare la cautare sesiuni profesor", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const s = await getSessionById(req.params.id);
    if (!s) return res.status(404).json({ message: "Sesiune inexistentă" });
    return res.json(await toPublicSession(s));
  } catch (err) {
    return res.status(500).json({ message: "Eroare la obtinere sesiune", error: err.message });
  }
});

router.put("/:id", authenticate, requireProfessor, async (req, res) => {
  try {
    const { description, startTime, endTime, maxSpots } = req.body;
    
    // Verifică dacă sesiunea aparține profesorului logat
    const existingSession = await getSessionById(req.params.id);
    if (!existingSession) {
      return res.status(404).json({ message: "Sesiune inexistentă" });
    }
    
    if (existingSession.professorId !== req.user.id) {
      return res.status(403).json({ message: "Nu poți modifica sesiunile altor profesori" });
    }

    const updates = {};
    if (description !== undefined) updates.description = description;
    if (startTime !== undefined) updates.startTime = new Date(startTime);
    if (endTime !== undefined) updates.endTime = new Date(endTime);
    if (maxSpots !== undefined) updates.maxSpots = maxSpots;

    const updated = await updateSession(req.params.id, updates);
    if (!updated) return res.status(404).json({ message: "Sesiune inexistentă" });
    return res.json(await toPublicSession(updated));
  } catch (err) {
    return res.status(500).json({ message: "Eroare la actualizare sesiune", error: err.message });
  }
});

export default router;
