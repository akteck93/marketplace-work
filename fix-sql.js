const fs = require('fs');
let sql = fs.readFileSync('migration.sql', 'utf8');

sql = sql.replace(/CREATE TYPE "([^"]+)" AS ENUM \(([^)]+)\);/g, `
DO $$ BEGIN
    CREATE TYPE "$1" AS ENUM ($2);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
`);

sql = sql.replace(/CREATE TABLE/g, 'CREATE TABLE IF NOT EXISTS');

sql = sql.replace(/CREATE UNIQUE INDEX/g, 'CREATE UNIQUE INDEX IF NOT EXISTS');

sql = sql.replace(/ALTER TABLE "([^"]+)" ADD CONSTRAINT "([^"]+)" (FOREIGN KEY [^;]+);/g, `
DO $$ BEGIN
    ALTER TABLE "$1" ADD CONSTRAINT "$2" $3;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
`);

fs.writeFileSync('migration_safe.sql', sql);
