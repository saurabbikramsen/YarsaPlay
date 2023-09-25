import { Statistics } from '../Dto/player.dto';

export const players = [
  {
    id: '74979d51-6d61-40bc-9a8f-73f11f910e32',
    name: 'shanti',
    role: 'player',
  },
  {
    id: '29daf96a-ed53-4ad8-871b-299af371f9a2',
    name: 'ssv',
    role: 'player',
  },
];

export const statistics = {
  games_played: 32,
  games_won: 22,
  coins: 232,
  experience_point: 323,
};
export const player = {
  id: '74979d51-3s61-40bc-9a8f-73f11f910e32',
  name: 'saurab',
  role: 'player',
  statistics: Statistics,
};

export const topPlayers = [
  {
    id: '749734251-3s61-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: Statistics,
  },
  {
    id: '74979d51-3s61-df34-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: Statistics,
  },
  {
    id: '74979d51-23d5-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: Statistics,
  },
  {
    id: '74vf3h51-3s61-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: Statistics,
  },
  {
    id: '71w3fd51-3s61-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: Statistics,
  },
];

export const rankedPlayers = [
  {
    id: '749734251-3s61-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: Statistics,
    rank: 1,
  },
  {
    id: '74979d51-3s61-df34-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: Statistics,
    rank: 2,
  },
  {
    id: '74979d51-23d5-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: Statistics,
    rank: 3,
  },
  {
    id: '74vf3h51-3s61-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: Statistics,
    rank: 4,
  },
  {
    id: '71w3fd51-3s61-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: Statistics,
    rank: 5,
  },
];

export const addPlayer = {
  name: 'saurab',
  email: 'saurab@gmail.com',
  password: 'saurab123',
};
export const loginInput = {
  email: 'saurab@gmail.com',
  password: 'saurab123',
};

export const signupDetails = {
  email: 'saurab@gmail.com',
  password: 'saurab123',
  name: 'saurab sen',
};

export const playerLoginDetail = {
  accessToken:
    'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdXJhYkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTM5OTE3NTIsImV4cCI6MTY5Mzk5NTM1Mn0.J8jYgtI5M3zEKApqhAhUnqY4j63fIIXdFRpBGzfL5MU',
  refreshToken:
    'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdXJhYkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTM5OTE3NTIsImV4cCI6MTY5Mzk5NTM1Mn0.J8jYgtI5M3zEKApqhAhUnqY4j63fIIXdFRpBGzfL5MU',
  role: player.role,
  id: player.id,
  name: player.name,
};

export const jwtPayload = {
  email: 'saurab@gmail.com',
  role: player.role,
};
export const jwtToken =
  'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdXJhYkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTM5OTE3NTIsImV4cCI6MTY5Mzk5NTM1Mn0.J8jYgtI5M3zEKApqhAhUnqY4j63fIIXdFRpBGzfL5MU';

export const hashPassword =
  '$argon2id$v=19$m=65536,t=3,p=4$lIZpyNVA5uxky6Kz/6NZAw$9KZz9m1s7WjQkVn10hUGI/B1kUHoSVg3cHzpfr/lW90';
