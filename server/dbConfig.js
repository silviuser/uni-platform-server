import Sequelize from 'sequelize';
import env from 'dotenv';

env.config();

const db = new Sequelize({
    dialect: process.env.DB_DIALECT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,   // <--- LINIA NOUĂ OBLIGATORIE
    logging: false,
    define: {
        timestamps: false,
        freezeTableName: true
    },
    dialectOptions: {           // <--- ADAUGĂ ȘI ASTA PENTRU AZURE
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})

export default db;