import { createPool } from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config();

export const pool = createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    database: process.env.MYSQL_ADDON_DB,
    password: process.env.MYSQL_ADDON_PASSWORD,
    port:3306

})
