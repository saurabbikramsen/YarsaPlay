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
  email: 'saurab@gmail.com',
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
  id: user.id,
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

export const argonPassword =
  '$argon2id$v=19$m=65536,t=3,p=4$qELsd7Nbmw0wFJiAigRygA$8apwdvR7Knazxf2dQsdxGzKeNdm9SkzvsD+ViHEVkmw';

export const tokenDecodeData = {
  email: 'sen@gmail.com',
  role: 'player',
  iat: 1695715530,
  exp: 1695719130,
};

export const refreshtoken =
  'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhdXJhYkBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2OTM5OTE3NTIsImV4cCI6MTY5Mzk5NTM1Mn0.J8jYgtI5M3zEKApqhAhUnqY4j63fIIXdFRpBGzfL5MU';
