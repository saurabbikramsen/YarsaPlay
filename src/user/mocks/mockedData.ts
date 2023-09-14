import { UserRole } from '../../enums/enums';

export const users = [
  {
    id: '74979d51-6d61-40bc-9a8f-73f11f910e32',
    name: 'saurab',
    role: 'admin',
  },
  {
    id: '29daf96a-ed53-4ad8-871b-299af371f9a2',
    name: 'swatantra',
    role: 'admin',
  },
];

export const user = {
  id: '74979d51-6d61-40bc-9a8f-73f11f910e32',
  name: 'saurab',
  role: 'admin',
  refresh_key: 'PePsi',
};
export const player = {
  id: '74979d51-3s61-40bc-9a8f-73f11f910e32',
  name: 'ssv',
  role: 'player',
  refresh_key: 'CoKe',
};

export const addUser = {
  name: 'saurab',
  email: 'saurab@gmail.com',
  role: UserRole.ADMIN,
  password: 'saurab123',
};
export const loginInput = {
  email: 'saurab@gmail.com',
  password: 'saurab123',
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
  email: 'saurab@gmail.com',
  role: user.role,
};
export const jwtToken =
  'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdXJhYkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTM5OTE3NTIsImV4cCI6MTY5Mzk5NTM1Mn0.J8jYgtI5M3zEKApqhAhUnqY4j63fIIXdFRpBGzfL5MU';

export const generareToken = {
  accessToken:
    'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdXJhYkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTM5OTE3NTIsImV4cCI6MTY5Mzk5NTM1Mn0.J8jYgtI5M3zEKApqhAhUnqY4j63fIIXdFRpBGzfL5MU',
  refreshToken:
    'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdXJhYkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTM5OTE3NTIsImV4cCI6MTY5Mzk5NTM1Mn0.J8jYgtI5M3zEKApqhAhUnqY4j63fIIXdFRpBGzfL5MU',
};
