const { Pool } = require("pg");

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Verifica la conexión
async function connect() {
  const client = await pool.connect();
  client.release();
}

// Crea las tablas si no existen
async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS respuestas (
      id            SERIAL PRIMARY KEY,
      respondente   VARCHAR(255),
      empresa       VARCHAR(255),
      cargo         VARCHAR(255),
      fecha         TIMESTAMPTZ DEFAULT NOW(),

      -- Sección 1: Infraestructura
      infra_0       SMALLINT CHECK (infra_0 BETWEEN 1 AND 5),
      infra_1       SMALLINT CHECK (infra_1 BETWEEN 1 AND 5),
      infra_2       SMALLINT CHECK (infra_2 BETWEEN 1 AND 5),
      infra_3       SMALLINT CHECK (infra_3 BETWEEN 1 AND 5),
      infra_4       SMALLINT CHECK (infra_4 BETWEEN 1 AND 5),

      -- Sección 2: Marketing
      mkt_0         SMALLINT CHECK (mkt_0 BETWEEN 1 AND 5),
      mkt_1         SMALLINT CHECK (mkt_1 BETWEEN 1 AND 5),
      mkt_2         SMALLINT CHECK (mkt_2 BETWEEN 1 AND 5),
      mkt_3         SMALLINT CHECK (mkt_3 BETWEEN 1 AND 5),
      mkt_4         SMALLINT CHECK (mkt_4 BETWEEN 1 AND 5),

      -- Sección 3: Operaciones
      ops_0         SMALLINT CHECK (ops_0 BETWEEN 1 AND 5),
      ops_1         SMALLINT CHECK (ops_1 BETWEEN 1 AND 5),
      ops_2         SMALLINT CHECK (ops_2 BETWEEN 1 AND 5),
      ops_3         SMALLINT CHECK (ops_3 BETWEEN 1 AND 5),
      ops_4         SMALLINT CHECK (ops_4 BETWEEN 1 AND 5),

      -- Sección 4: Experiencia del cliente
      cx_0          SMALLINT CHECK (cx_0 BETWEEN 1 AND 5),
      cx_1          SMALLINT CHECK (cx_1 BETWEEN 1 AND 5),
      cx_2          SMALLINT CHECK (cx_2 BETWEEN 1 AND 5),
      cx_3          SMALLINT CHECK (cx_3 BETWEEN 1 AND 5),
      cx_4          SMALLINT CHECK (cx_4 BETWEEN 1 AND 5),

      -- Sección 5: Cultura
      cult_0        SMALLINT CHECK (cult_0 BETWEEN 1 AND 5),
      cult_1        SMALLINT CHECK (cult_1 BETWEEN 1 AND 5),
      cult_2        SMALLINT CHECK (cult_2 BETWEEN 1 AND 5),
      cult_3        SMALLINT CHECK (cult_3 BETWEEN 1 AND 5),
      cult_4        SMALLINT CHECK (cult_4 BETWEEN 1 AND 5),

      -- Sección 6: Estrategia
      strat_0       SMALLINT CHECK (strat_0 BETWEEN 1 AND 5),
      strat_1       SMALLINT CHECK (strat_1 BETWEEN 1 AND 5),
      strat_2       SMALLINT CHECK (strat_2 BETWEEN 1 AND 5),
      strat_3       SMALLINT CHECK (strat_3 BETWEEN 1 AND 5),
      strat_4       SMALLINT CHECK (strat_4 BETWEEN 1 AND 5),

      -- Sección 7: Integración
      int_0         SMALLINT CHECK (int_0 BETWEEN 1 AND 5),
      int_1         SMALLINT CHECK (int_1 BETWEEN 1 AND 5),
      int_2         SMALLINT CHECK (int_2 BETWEEN 1 AND 5),
      int_3         SMALLINT CHECK (int_3 BETWEEN 1 AND 5),
      int_4         SMALLINT CHECK (int_4 BETWEEN 1 AND 5)
    );
  `);
}

module.exports = { pool, connect, initSchema };
