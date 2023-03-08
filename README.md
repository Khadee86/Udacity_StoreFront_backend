# STORE FRONT BACKEND PROJECT
This project involves the creation of a backend for a store front project using handlers, migrations, models, postgres, jasmine for testing, express and so on.

## STARTER CONFIGURATION AND INSTRUCTIONS

* To install yarn if you do not already have it
   npm install -g yarn

* To install packages
   yarn add

* To run migrations
   yarn db-up -- for up migrations to create tables
   yarn db-down--for down migrations to drop tables

* To run Test
   yarn test-db

* To run app
   yarn start

* To build app
   yarn build

## TO SETUP .env FILE

```POSTGRES_HOST=127.0.0.1
POSTGRES_DB=store_front
POSTGRES_USER=####
POSTGRES_PASSWORD=####
POSTGRES_TEST_DB=store_front_test
ENV=dev
BCRYPT_PASSWORD=####
SALT_ROUNDS=10
TOKEN_SECRET=####```

## TO SETUP POSTGRES CONNECTION IN SQL terminal
* CREATE USER '####' WITH PASSWORD 'YOUR_PASSWORD_HERE';
* CREATE DATABASE store_front;
\c storefront;
* GRANT ALL PRIVILEGES ON DATABASE store_front TO 'ENTER USER YOU CREATED HERE';
* CREATE DATABASE store_front_test;
\c store_front_test;
* GRANT ALL PRIVILEGES ON DATABASE store_front_test TO 'ENTER USER YOU CREATED HERE';

## PORT USED
The application runs on port 0.0.0.0:3000 with database on 5432

## TO SETUP database.json FILE
```{
"dev": {
"driver": "pg",
"host": "127.0.0.1",
"database": "store_front",
"user": "####",
"password": "####"
},
"test": {
"driver": "pg",
"host": "127.0.0.1",
"database": "store_front_test",
"user": "####",
"password": "####"
}
}```
