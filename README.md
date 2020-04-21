# MPERN Auth

## Purpose

<p>This repo is part of a larger project related to a Blog application using a MPERN Microservice Architecture for the bigger pictuer please refer to the main [repo](https://github.com/crcnum4/MPERN-MS)</p>

## Service Details

<p>This is the Authentication Microservice which will handle the following: Maintain and Manage the User Table and Profile Table.</P>

### Front End

<p>The microservice will provide the following capabilities to the React front-end</p>
- Register a new account
- Login
- View other profile public data
- Authenticated actions
-- Add profile to a user account
-- Pull personal profile data
-- Update profile data

### Microservice communication

<p>This microservice will also provide the following capabilities to other microservices.</p>
<p>
* Authenticate Auth Tokens and return either:
  * User Id
  * Profile ID and/or profile data
* Access additional public profile data if needed.
</p>

### Usage

<p>The only unique item needed to communicate with the Auth service with the protected routes is to provide the auth token under the `x-auth-token` header in the request.

## Configuration

### Database

<p>Service uses a postgresql database. Utilize the database.sql file to create the database. The database.sql file will create the two tables as well as add in the uuid extension the profile table uses.</p>

### config/default.js

<p>Protected keys are in a gitignored config folder. Refer to the defaultExample.js file to create your default.js file correctly. This file should be stored in a config folder. this file mostly contains the db details for pg and the key used to generate a jsonwebtoken.</p>
