//database.js
import pkg from 'pg';
const { Pool } = pkg;

const config = {
    user: "postgres",
    host: "localhost",
    database: "likeme",
    password: "1234",
    port: 5432,
};

const pool = new Pool(config);

// Agregado para verificar la conexión a la base de datos
pool.on('connect', () => {
    console.log('Conexión a la base de datos establecida correctamente');
});

pool.on('error', (err) => {
    console.error('Error en la conexión a la base de datos:', err);
});

export default pool;
