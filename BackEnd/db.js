
const sql = require("mssql");

const config = {
    user: "sa",
    password: "Password123!",
    server: "localhost",
    port: 1433,
    database: "Parcial2",
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Conectado correctamente a SQL Server");
        return pool;
    })
    .catch(error => {
        console.error("Error conectando a SQL Server:");
        console.error(error);
        throw error;
    });

module.exports = {
    sql,
    poolPromise
};
