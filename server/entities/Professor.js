import db from "../dbConfig.js";
import Sequelize from "sequelize";

const Professor = db.define("Professor", {
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
	department: {
		type: Sequelize.STRING(100),
		allowNull: true,
	},
	createdAt: {
		type: Sequelize.DATE,
		allowNull: false,
		defaultValue: Sequelize.NOW,
	},
}, {
	tableName: "Professors",
	timestamps: false,
	indexes: [
		{
			unique: true,
			fields: ["email"],
		},
	],
});

export default Professor;
