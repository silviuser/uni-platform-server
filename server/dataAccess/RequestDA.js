import Request from "../entities/Request.js";
import Session from "../entities/Session.js";
import Professor from "../entities/Professor.js";
import UniversitySession from "../entities/UniversitySession.js";
import Student from "../entities/Student.js";

async function createRequest(request) {
  return Request.create(request);
}

async function getRequests() {
  return Request.findAll({
    include: [
      {
        model: Student,
        as: 'student',
        attributes: ['id', 'fullName', 'faculty', 'specialization', 'group']
      },
      {
        model: Session,
        as: 'session',
        attributes: ['id', 'professorId', 'startTime', 'endTime', 'maxSpots'],
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
      }
    ]
  });
}

async function getRequestById(id) {
  return Request.findByPk(id);
}

async function getRequestsByStudent(studentId) {
  return Request.findAll({
    where: { studentId },
    include: [
      {
        model: Session,
        as: 'session',
        attributes: ['id', 'startTime', 'endTime'],
        include: [
          {
            model: Professor,
            as: 'professor',
            attributes: ['id', 'fullName', 'department']
          },
          {
            model: UniversitySession,
            as: 'universitySession',
            attributes: ['id', 'name']
          }
        ]
      }
    ]
  });
}

async function getRequestsBySession(sessionId) {
  return Request.findAll({ 
    where: { sessionId },
    include: [
      {
        model: Student,
        as: 'student',
        attributes: ['id', 'fullName', 'faculty', 'specialization', 'group']
      },
      {
        model: Session,
        as: 'session',
        attributes: ['id', 'startTime', 'endTime', 'maxSpots'],
        include: [
          {
            model: UniversitySession,
            as: 'universitySession',
            attributes: ['id', 'name', 'academicYear', 'type']
          }
        ]
      }
    ]
  });
}

async function updateRequest(id, updates) {
  const req = await Request.findByPk(id);
  if (!req) return null;
  Object.assign(req, updates);
  return req.save();
}

async function deleteRequest(id) {
  const req = await Request.findByPk(id);
  if (!req) return null;
  await req.destroy();
  return req;
}

export {
  createRequest,
  getRequests,
  getRequestById,
  getRequestsByStudent,
  getRequestsBySession,
  updateRequest,
  deleteRequest,
};