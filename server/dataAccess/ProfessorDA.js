import Professor from "../entities/Professor.js";

async function createProfessor(professor) {
  return Professor.create(professor);
}

async function getProfessors() {
  return Professor.findAll();
}

async function getProfessorById(id) {
  return Professor.findByPk(id);
}

async function getProfessorByEmail(email) {
  return Professor.findOne({ where: { email } });
}

async function updateProfessor(id, fields) {
  const professor = await Professor.findByPk(id);
  if (!professor) return null;
  
  const allowedFields = ['fullName', 'department'];
  allowedFields.forEach(field => {
    if (field in fields) {
      professor[field] = fields[field];
    }
  });
  
  return professor.save();
}

export {
  createProfessor,
  getProfessors,
  getProfessorById,
  getProfessorByEmail,
  updateProfessor,
};