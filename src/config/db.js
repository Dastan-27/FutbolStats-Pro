const { Pool } = require('pg');
require('dotenv').config();

// ✅ ERROR 1 (INFRAESTRUCTURA) Corregido: El string de conexión usa el nombre del servicio
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password123@db_futbol:5432/futbol_db';

const pool = new Pool({
  connectionString,
});

// ✅ Inicialización automática de la tabla en producción y desarrollo
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

    // Seed de prueba si está vacía la tabla
    const res = await pool.query('SELECT COUNT(*) FROM equipos');
    if (parseInt(res.rows[0].count, 10) === 0) {
      await pool.query("INSERT INTO equipos (nombre, puntos, diferencia_goles) VALUES ('ITP F.C.', 9, 5);");
      console.log('🌱 Semilla de equipos iniciales agregada.');
    }
  } catch (err) {
    console.error('❌ Error al inicializar las tablas de la base de datos:', err.message);
  }
};

pool.on('connect', () => {
  console.log('⚡ Conexión exitosa a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en el pool de Postgres', err);
});

// Ejecutar inicialización (evitar bloquear las pruebas unitarias)
if (process.env.NODE_ENV !== 'test') {
  initDb();
}

module.exports = pool;