import UniversitySession from "../entities/UniversitySession.js";

async function createUniversitySession(session) {
    return UniversitySession.create(session);
}

async function getUniversitySessions() {
    return UniversitySession.findAll();
}

export {
    createUniversitySession,
    getUniversitySessions
};