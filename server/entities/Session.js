import db from "../dbConfig.js";
import Sequelize from "sequelize";

const Session = db.define("Session", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
		allowNull: false,
	},
	professorId: {
		type: Sequelize.UUID,
		allowNull: false,
		references: {
			model: "Professors",
			key: "id",
		},
		onUpdate: "CASCADE",
		onDelete: "CASCADE",
	},
	description: {
		type: Sequelize.STRING,
		allowNull: true,
	},
	startTime: {
		type: Sequelize.DATE,
		allowNull: false,
		validate: {
			isDate: true,
		},
	},
	endTime: {
		type: Sequelize.DATE,
		allowNull: false,
		validate: {
			isDate: true,
			isAfterStart(value) {
				if (this.startTime && value <= this.startTime) {
					throw new Error("endTime must be after startTime");
				}
			},
		},
	},
	maxSpots: {
		type: Sequelize.INTEGER,
		allowNull: false,
		validate: {
			min: 1,
		},
	},
	availableSpots: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0, // Se va seta automat la maxSpots când se creează
		validate: {
			min: 0,
		},
	},
	universitySessionId: {
        type: Sequelize.UUID,
        allowNull: false, // O sesiune trebuie obligatoriu să aparțină unei sesiuni universitare
        references: {
            model: "UniversitySessions",
            key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    }
	}, {
	tableName: "Sessions",
	timestamps: false,
	indexes: [
		{
			fields: ["professorId", "startTime"],
		},
	],
});

export default Session;
