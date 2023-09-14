
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

- Install and run redis in docker in appropriate port.

- In the env file
  - For DATABASE_URL variable, Change the username, password, as your postgres setup  and provide a dbname.
  - Set your 'ACCESS_TOKEN_SECRET' AND 'REFRESH_TOKEN_SECRET'
  - provide expiry time for access and refresh token
  - Set a appropriate port number for nestapp
  - Initialize the time for 'REDIS_STORE_TIME'
  - Set 'REDIS_PORT' to appropriate port where your redis is running

- After running locally '/api' is the route for swagger documentation.
- In swagger documentation seed the first admin user through "user/seed" route.
- now you can login as admin and get access token and refresh token to perform other tasks.
- Create players to play games and increase stats.
- View leaderboard to see top 5 players.

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
  #seed 100 players
  $ yarn seed
  ````

```bash
  # to view database data
  $ npx prisma studio
  ````

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

# Note
- run e2e test which will seed the first admin user:
  - email : saurabsen@gmail.com
  - password : saurabsen123
    