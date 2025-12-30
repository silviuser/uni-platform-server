import Student from "../entities/Student.js";

async function createStudent(student) {
    return Student.create(student);
}

async function getStudents() {
    return Student.findAll();
}

async function getStudentById(id) {
    return Student.findByPk(id);
}

async function getStudentByEmail(email) {
    return Student.findOne({ where: { email } });
}

async function updateStudent(id, fields) {
    const student = await Student.findByPk(id);
    if (!student) return null;

    // Only allow updating specific fields
    const allowed = ["fullName", "faculty", "specialization", "group"];
    for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(fields, key)) {
            student[key] = fields[key];
        }
    }

    await student.save();
    return student;
}

export {
    createStudent,
    getStudents,
    getStudentById,
    getStudentByEmail,
    updateStudent,
};