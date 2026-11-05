// Efface la base de développement locale pour repartir des données de démo.
import pg from "pg"

const client = new pg.Client("postgres://postgres:postgres@localhost:5432/postgres")
await client.connect()
await client.query("drop database if exists voltoudou with (force)")
await client.query("create database voltoudou encoding 'UTF8' template template0 lc_collate 'C' lc_ctype 'C'")
await client.end()
console.log("Base voltoudou recréée")
