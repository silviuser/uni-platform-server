import mysql from "mysql2/promise";
import env from "dotenv";
import db from "../dbConfig.js";
import Student from "./Student.js";
import Professor from "./Professor.js";
import Request from "./Request.js";
import Session from "./Session.js";
import UniversitySession from "./UniversitySession.js";

env.config();

function Create_DB(){
let conn;

    mysql.createConnection({
        host: process.env.DB_HOST,    // <--- LINIA NOUĂ
        user : process.env.DB_USERNAME,
        password : process.env.DB_PASSWORD,
        ssl: { rejectUnauthorized: false } // <--- IMPORTANT PENTRU AZURE
    })
    .then((connection) => {
    conn = connection
    return connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`)
    })
    .then(() => {
    return conn.end()
    })
    .catch((err) => {
    console.warn(err.stack)
    })
}

function FK_Config() {
    Professor.hasMany(Session, { foreignKey: "professorId", as: "sessions" });
    Session.belongsTo(Professor, { foreignKey: "professorId", as: "professor" });

    Session.hasMany(Request, { foreignKey: "sessionId", as: "requests" });
    Request.belongsTo(Session, { foreignKey: "sessionId", as: "session" });

    Student.hasMany(Request, { foreignKey: "studentId", as: "requests" });
    Request.belongsTo(Student, { foreignKey: "studentId", as: "student" });

    UniversitySession.hasMany(Session, { foreignKey: "universitySessionId", as: "professorSessions" });
    Session.belongsTo(UniversitySession, { foreignKey: "universitySessionId", as: "universitySession" });
}

function DB_Init(){
    Create_DB();
    FK_Config();
    db.sync({ alter: true });
}

export default DB_Init;