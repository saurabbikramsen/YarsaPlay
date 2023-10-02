
# Yarsa Play Review




## Features

- Authentication and Authorization using guards
- Redis cache implementation for storing user leaderboard
- Play game to earn xp and coins
- Socket chat implementation for personal chats and room chats.




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
  - Set an appropriate port number for nest-app
  - Initialize the time for 'REDIS_STORE_TIME'
  - Set 'REDIS_PORT' to appropriate port where your redis is running
  - Install all packages
  - Apply all the migrations using command below. 
  - Run the app using yarn start:dev for development mode.

- After running locally '/api' is the route for swagger documentation.
- Run e2e test which will seed the first admin user:
  - email : saurab@gmail.com
  - password : saurab123
- now you can log in as admin and get access token and refresh token to perform other tasks.
- Create players and play games to increase their stats.
- Seed 100 players using command below.
- View leaderboard to see top 5 players.
- For socket APIs documentation '/async-api' is the provided route.
- For socket client reference there is 3 clients present in the clients folder.

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
- seed 100 players
- The password for the seeded players is their_name123
- See the seeded players using command below:

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

