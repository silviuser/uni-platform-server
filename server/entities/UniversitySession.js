import db from "../dbConfig.js";
import Sequelize from "sequelize";

const UniversitySession = db.define("UniversitySession", {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false, // Ex: "Licență Iunie 2024"
    },
    academicYear: {
        type: Sequelize.STRING,
        allowNull: false, // Ex: "2023-2024"
    },
    type: {
        type: Sequelize.ENUM("SUMMER", "AUTUMN", "WINTER"),
        allowNull: false,
    }
}, {
    tableName: "UniversitySessions",
    timestamps: false
});

export default UniversitySession;