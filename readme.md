
# Yarsa Play Review




## Features

- Authentication and Authorization using guards
- redis cache implementation for storing user leaderboard
- play game to earn xp and coins



## Prerequisite

- nodejs v-16 or higher
- docker

## How To Get Started


- Copy the variables in example.env to .env file

- Install and run postgres in docker,
  - use your own username, password, and set port to 5432

- In the env file
  - For DATABASE_URL variable, Change the username, password, as your postgres setup  and provide a dbname.
  - Set your 'ACCESS_TOKEN_SECRET' AND 'REFRESH_TOKEN_SECRET'

- Install and run redis in docker in port 6379.

## Installation

```bash
  # install all packages
  $ yarn install
```

```bash
  # apply all migrations
  $ prisma migrate dev
```

## Run Locally


```bash
  # watch mode
  $ yarn start:dev
```

```bash
  # build mode
  $ nest build
```

```bash
  # production mode
  $ yarn start:prod
```





## Test

```bash
  # unit tests
  $ yarn run test
```

```bash
  # e2e tests
  $ yarn run test:e2e
```
## note:
- Before performing the e2e test 
  - seed one admin user.
  - provide appropriate userId for the test that is present in the database.
- While seeding the first admin
  - set any appropriate gmail.
  - As password are verified by argon set password to: 
    - $argon2id$v=19$m=65536,t=3,p=4$z5Xdz/TdsLVl6LUUczeelg$ps344D94c2EcW1hZRoCqSYrCe3tMVhwA9qHu7OBrTCw
    -  this password accounts to : saurab123
  - now you can login and get access token and refresh token and create new users and delete the seeded one.
