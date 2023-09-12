import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController E2E test (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  const userId = '74979d51-6d61-40bc-9a8f-73f11f910e32';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should login the user ', async () => {
    const loginDetail = { email: 'saurabsen@gmail.com', password: 'saurab123' };
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send(loginDetail)
      .expect(201);

    accessToken = response.body.accessToken;
    console.log(accessToken);
    expect(response.body).toBeDefined();
  });

  it('should add a user', async () => {
    const newUser = {
      name: 'shreejan sen',
      password: 'shreejan',
      email: 'shreejan@gmail.com',
      role: 'staff',
    };
    const response = await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newUser)
      .expect(HttpStatus.CREATED);

    expect(response.body).toBeDefined();
  });

  it('get a particular user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    accessToken = response.body.accessToken;
    expect(response.body).toBeDefined();
  });

  it('should get all the users', async () => {
    const response = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it('should update a user', async () => {
    const newUser = {
      name: 'dari sen',
      password: 'saurab123',
      email: 'don@gmail.com',
      role: 'staff',
    };
    const response = await request(app.getHttpServer())
      .put(`/user/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newUser)
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it('should delete a user', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/user/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    expect(response.body).toBeDefined();
  });
});
