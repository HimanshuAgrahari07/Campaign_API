const mariadb = require('mariadb');
require('dotenv').config()

const {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_MAX_CONNECTION_LIMIT,
    DB_NAME,
    DB_PORT
} = process.env;

const poolDetails = {
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    connectionLimit: Number(DB_MAX_CONNECTION_LIMIT),
    database: DB_NAME,
    port: Number(DB_PORT)
}

const pool = mariadb.createPool(poolDetails);

const runQuery = async (query: string) => {
    let connection;
    let res;
    try {
        connection = await pool.getConnection();
        res = await connection.query(query);
        return res
    } catch (err) {
        throw err;
    }
    finally {
        if (connection) connection.end();
    }
}

export default runQuery;