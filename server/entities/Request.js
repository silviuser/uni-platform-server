import db from "../dbConfig.js";
import Sequelize from "sequelize";

const Request = db.define("Request", {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true,
		allowNull: false,
	},
	studentId: {
		type: Sequelize.UUID,
		allowNull: false,
		references: {
			model: "Students",
			key: "id",
		},
		onUpdate: "CASCADE",
		onDelete: "CASCADE",
	},
	sessionId: {
		type: Sequelize.UUID,
		allowNull: false,
		references: {
			model: "Sessions",
			key: "id",
		},
		onUpdate: "CASCADE",
		onDelete: "CASCADE",
	},
	status: {
		type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
		allowNull: false,
		defaultValue: "PENDING",
	},
	rejectionReason: {
		type: Sequelize.TEXT,
		allowNull: true,
		validate: {
			requiredWhenRejected(value) {
				if (this.status === "REJECTED" && (!value || value.trim() === "")) {
					throw new Error("rejectionReason is required when status is REJECTED");
				}
			},
		},
	},
	studentFile: {
		type: Sequelize.STRING(255),
		allowNull: true,
		validate: {
			onlyAfterApproval(value) {
				if (value && this.status !== "APPROVED") {
					throw new Error("studentFile can be set only when status is APPROVED");
				}
			},
		},
	},
	applicationMessage: {
		type: Sequelize.TEXT,
		allowNull: true,
	},
	teacherFile: {
		type: Sequelize.STRING(255),
		allowNull: true,
		validate: {
			notWhilePending(value) {
				if (value && this.status === "PENDING") {
					throw new Error("teacherFile cannot be set while status is PENDING");
				}
			},
		},
	},
	createdAt: {
		type: Sequelize.DATE,
		allowNull: false,
		defaultValue: Sequelize.NOW,
	},
	updatedAt: {
		type: Sequelize.DATE,
		allowNull: false,
		defaultValue: Sequelize.NOW,
	},
}, {
	tableName: "Requests",
	timestamps: true,
	indexes: [
		{ fields: ["studentId"] },
		{ fields: ["sessionId"] },
		{ fields: ["status"] },
	],
});

export default Request;
