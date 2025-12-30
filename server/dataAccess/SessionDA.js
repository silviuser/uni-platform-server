import Session from "../entities/Session.js";
import Professor from "../entities/Professor.js";
import UniversitySession from "../entities/UniversitySession.js";
import { Op } from "sequelize";

async function createSession(session) {
  return Session.create(session);
}

async function getSessions() {
  return Session.findAll({
    include: [
      {
        model: Professor,
        as: 'professor',
        attributes: ['id', 'fullName', 'department']
      },
      {
        model: UniversitySession,
        as: 'universitySession',
        attributes: ['id', 'name', 'academicYear', 'type']
      }
    ]
  });
}

async function getSessionById(id) {
  return Session.findByPk(id);
}

async function getSessionsByProfessor(professorId) {
  return Session.findAll({ where: { professorId } });
}

async function findOverlappingSessions(professorId, startTime, endTime) {
  return Session.findAll({
    where: {
      professorId,
      startTime: { [Op.lt]: endTime },
      endTime: { [Op.gt]: startTime },
    },
  });
}

async function updateSession(id, updates) {
  const s = await Session.findByPk(id);
  if (!s) return null;
  Object.assign(s, updates);
  return s.save();
}

export {
  createSession,
  getSessions,
  getSessionById,
  getSessionsByProfessor,
  findOverlappingSessions,
  updateSession,
};