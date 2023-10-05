
# Yarsa Play Review




## Features

- Authentication and Authorization using guards
- Redis cache implementation for storing user leaderboard
- Play game to earn xp and coins
- Socket chat implementation for personal chats and room chats.




## Prerequisite

- nodejs v-16 or higher
- docker
- pnpm installed

## How To Get Started

- If pnpm not installed use code 
  - npm install -g pnpm
- Create .env file
- Copy the variables in example.env to .env file
- Install and run postgres and redis in docker, 
  - run code: $ docker compose up -d

- In the env file
  - Set your 'ACCESS_TOKEN_SECRET' AND 'REFRESH_TOKEN_SECRET'
  - Provide expiry time (in minutes or hour or day) for access and refresh token 
  - Set an appropriate port number for nest-app in PORT variable


- Install all packages using command below.
- Apply all the migrations using command below. 
- Run the app using pnpm start:dev for development mode.

- After running locally 'http://localhost:[port]/api' is the route for swagger documentation.
- Run e2e test which will seed the first admin user:
  - email : saurab@gmail.com
  - password : saurab123
- Create players and play games to increase their stats.
- Seed 100 players using command below.
- View leaderboard to see top 5 players.
- For socket APIs documentation 'http://localhost:[port]/async-api' is the provided route.
- For socket client reference there is 3 clients present in the clients folder.

## Installation

```bash
  # install all packages
  $ pnpm install
```

```bash
  # apply all migrations
  $ prisma migrate dev
```



## Run Locally


```bash
  # watch mode
  $ pnpm start:dev
```

```bash
  #seed 100 players
  $ pnpm seed
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
  $ pnpm start:prod
```





## Test

```bash
  # unit tests
  $ pnpm run test
```

```bash
  # e2e tests
  $ pnpm run test:e2e
```

