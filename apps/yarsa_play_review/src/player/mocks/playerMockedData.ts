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
export const playResponse = {
  data: statistics,
  message: 'game won' && 'game lost',
};
export const player = {
  id: '74979d51-3s61-40bc-9a8f-73f11f910e32',
  name: 'saurab',
  role: 'player',
  active: true,
  refresh_key: 'dddddd',
  statistics: statistics,
};

export const topPlayers = [
  {
    id: '749734251-3s61-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: statistics,
  },
  {
    id: '74979d51-3s61-df34-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: statistics,
  },
  {
    id: '74979d51-23d5-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: statistics,
  },
  {
    id: '74vf3h51-3s61-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: statistics,
  },
  {
    id: '71w3fd51-3s61-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: statistics,
  },
];

export const rankedPlayers = [
  {
    id: '749734251-3s61-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: statistics,
    rank: 1,
  },
  {
    id: '74979d51-3s61-df34-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: statistics,
    rank: 2,
  },
  {
    id: '74979d51-23d5-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: statistics,
    rank: 3,
  },
  {
    id: '74vf3h51-3s61-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: statistics,
    rank: 4,
  },
  {
    id: '71w3fd51-3s61-40bc-9a8f-73f11f910e32',
    name: 'ssv',
    role: 'player',
    statistics: statistics,
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

export const userLoginInfo = {
  id: player.id,
  name: 'saurab',
  role: 'player',
  email: 'saurab@gmail.com',
  password:
    '$argon2id$v=19$m=65536,t=3,p=4$NLQKCPZJC1boicab/t5I6Q$7Uk3Ywjd4DCFCawLrhev2VEKGjohP+wpYFLQKZeYHyc',
};

export const tokens = {
  accessToken: playerLoginDetail.accessToken,
  refreshToken: playerLoginDetail.refreshToken,
};

export const jwtPayload = {
  id: player.id,
  role: player.role,
};

export const jwtPlayerRefreshPayload = {
  ...jwtPayload,
  refresh_key: 'sdfaee',
};

export const jwtToken =
  'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdXJhYkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTM5OTE3NTIsImV4cCI6MTY5Mzk5NTM1Mn0.J8jYgtI5M3zEKApqhAhUnqY4j63fIIXdFRpBGzfL5MU';

export const hashPassword =
  '$argon2id$v=19$m=65536,t=3,p=4$lIZpyNVA5uxky6Kz/6NZAw$9KZz9m1s7WjQkVn10hUGI/B1kUHoSVg3cHzpfr/lW90';

export const paginatedPlayer = {
  data: [
    {
      id: '697f7f2c-11f5-4621-99b9-1b3bb650a968',
      name: 'Lisandro',
      active: true,
      statistics: {
        coins: 340,
        experience_point: 1194,
        games_played: 45,
        games_won: 23,
      },
    },
    {
      id: '8eb07ab9-5924-4bf9-9c4f-ffe8a1f83fc5',
      name: 'Rosario',
      active: true,
      statistics: {
        coins: 316,
        experience_point: 1309,
        games_played: 48,
        games_won: 25,
      },
    },
  ],
  meta: {
    totalItems: 7,
    itemsPerPage: 2,
    currentPage: 1,
    totalPages: 4,
    hasNextPage: true,
    hasPreviousPage: false,
  },
  links: {
    first: '/player?page=1&pageSize=2',
    prev: null,
    next: '/player?page=2&pageSize=2',
    last: '/player?page=4&pageSize=2',
  },
};

export const playerData = [
  {
    id: '697f7f2c-11f5-4621-99b9-1b3bb650a968',
    name: 'Lisandro',
    active: true,
    statistics: {
      coins: 340,
      experience_point: 1194,
      games_played: 45,
      games_won: 23,
    },
  },
  {
    id: '8eb07ab9-5924-4bf9-9c4f-ffe8a1f83fc5',
    name: 'Rosario',
    active: true,
    statistics: {
      coins: 316,
      experience_point: 1309,
      games_played: 48,
      games_won: 25,
    },
  },
];
