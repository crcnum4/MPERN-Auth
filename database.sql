CREATE DATABASE mpernauth;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE auth(
  auth_id SERIAL PRIMARY KEY,
  username VARCHAR (50) UNIQUE NOT NULL,
  password VARCHAR (100) NOT NULL,
  email VARCHAR(355) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

CREATE TABLE profile (
  profile_id uuid PRIMARY KEY uuid_generate_v4 (), -- profile_id SERIAL PRIMARY KEY,
  auth_id SERIAL REFERENCES auth(auth_id),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  avatar VARCHAR(355), -- could be set to VARCHAR or TEXT for non limiting
  github VARCHAR(355), -- could also be set to varchar or text for non limiting
  cohort varchar(8),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON profile
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

/* good commands to remember for configuring your database
ALTER TABLE <table> ALTER COLUMN <column>
  TYPE <NEW DATATYPE> -- Can be used to alter the size of a VARCHAR(n)
  SET DEFAULT <default value> -- can be used to change/add the default value for FUTURE  inserts
ALTER TABLE <table> ADD COLUMN <column> <type> <constraints>
https://www.postgresql.org/docs/9.5/ddl-alter.html
