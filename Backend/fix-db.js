const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  connectionString: process.env.DATABASE_URL
});

async function run() {
  await client.connect();
  try {
    await client.query(`ALTER TABLE "operations" ADD COLUMN IF NOT EXISTS "departmentId" INTEGER;`);
    console.log("Success: departmentId added");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
