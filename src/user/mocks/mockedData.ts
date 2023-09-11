export const users = [
  {
    id: '74979d51-6d61-40bc-9a8f-73f11f910e32',
    created_at: new Date('2023-08-31T11:50:11.485Z'),
    updated_at: new Date('2023-08-31T11:50:11.485Z'),
    name: 'saurab',
    email: 'saurab@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$EVJKoOqkz2xUh46zyubXiQ$9lGmO4To105gNoc7A2sgGsmA8mg0SggrQG2ONxcjTow',
    role: 'admin',
  },
  {
    id: '29daf96a-ed53-4ad8-871b-299af371f9a2',
    created_at: new Date('2023-08-31T11:54:22.701Z'),
    updated_at: new Date('2023-08-31T11:54:22.701Z'),
    name: 'swatantra',
    email: 'swatantra@gmail.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$QTABnEUaUmB2gls4oSmXzg$n67f4RqNQVJnkCPYLy2NCadoY6RBkkZXqGEq4mAaDTw',
    role: 'admin',
  },
];

export const user = {
  id: '74979d51-6d61-40bc-9a8f-73f11f910e32',
  created_at: new Date('2023-08-31T11:50:11.485Z'),
  updated_at: new Date('2023-08-31T11:50:11.485Z'),
  name: 'saurab',
  email: 'saurab@gmail.com',
  password:
    '$argon2id$v=19$m=65536,t=3,p=4$EVJKoOqkz2xUh46zyubXiQ$9lGmO4To105gNoc7A2sgGsmA8mg0SggrQG2ONxcjTow',
  role: 'admin',
};

export const addUser = {
  name: 'saurab',
  email: 'saurab@gmail.com',
  role: 'player',
  password: 'saurab345',
};

export const loginDetail = {
  accessToken:
    'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdXJhYkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTM5OTE3NTIsImV4cCI6MTY5Mzk5NTM1Mn0.J8jYgtI5M3zEKApqhAhUnqY4j63fIIXdFRpBGzfL5MU',
  refreshToken:
    'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdXJhYkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTM5OTE3NTIsImV4cCI6MTY5Mzk5NTM1Mn0.J8jYgtI5M3zEKApqhAhUnqY4j63fIIXdFRpBGzfL5MU',
  role: user.role,
  id: user.id,
  name: user.name,
};

export const jwtPayload = {
  email: user.email,
  role: user.role,
};
export const jwtToken =
  'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdXJhYkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTM5OTE3NTIsImV4cCI6MTY5Mzk5NTM1Mn0.J8jYgtI5M3zEKApqhAhUnqY4j63fIIXdFRpBGzfL5MU';
