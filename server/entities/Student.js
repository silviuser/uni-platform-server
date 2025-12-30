import db from "../dbConfig.js";
import Sequelize from "sequelize";

const Student = db.define("Student", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING(255),
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true,
			len: [1, 255],
		},
	},
	password: {
		type: Sequelize.STRING(255),
		allowNull: false,
	},
	fullName: {
		type: Sequelize.STRING(150),
		allowNull: false,
	},
	faculty: {
		type: Sequelize.STRING(150),
		allowNull: false,
	},
	specialization: {
		type: Sequelize.STRING(150),
		allowNull: false,
	},
	group: {
		type: Sequelize.STRING(50),
		allowNull: false,
	},
	createdAt: {
		type: Sequelize.DATE,
		allowNull: false,
		defaultValue: Sequelize.NOW,
	},
}, {
	tableName: "Students",
	timestamps: false,
	indexes: [
		{
			unique: true,
			fields: ["email"],
		},
	],
});

export default Student;