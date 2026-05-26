const { Pool } = require('pg');
require('dotenv').config();

// ❌ ERROR 1 (INFRAESTRUCTURA): El string de conexión usa 'localhost' en lugar del nombre 
// del servicio de Docker ('db_futbol'). Esto hará que falle DENTRO del contenedor del backend.
const connectionString = process.env.DATABASE_URL

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('connect', () => {
  console.log('⚡ Conexión exitosa a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de Postgres', err);
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS equipos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        puntos INT DEFAULT 0,
        diferencia_goles INT DEFAULT 0
      );
    `);
    console.log('📦 Tabla "equipos" asegurada en la base de datos.');

    const res = await pool.query('SELECT COUNT(*) FROM equipos');
    if (parseInt(res.rows[0].count, 10) === 0) {
      await pool.query("INSERT INTO equipos (nombre, puntos, diferencia_goles) VALUES ('ITP F.C.', 9, 5);");
      console.log('🌱 Semilla de equipos iniciales agregada.');
    }
  } catch (err) {
    console.error('❌ Error al inicializar las tablas de la base de datos:', err.message);
  }
};

if (process.env.NODE_ENV !== 'test') {
  initDb();
}

module.exports = pool;