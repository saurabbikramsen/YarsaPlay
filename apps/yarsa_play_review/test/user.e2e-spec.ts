import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UserController E2E test (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should seed a admin user', async () => {
    const newUser = {
      name: 'saurab sen',
      password: 'saurab123',
      email: 'saurab@gmail.com',
    };
    const response = await request(app.getHttpServer())
      .post('/user/seed')
      .send(newUser)
      .expect(HttpStatus.CREATED);
    expect(response.body).toBeDefined();
  });

  it('should login the user ', async () => {
    const loginDetail = { email: 'saurab@gmail.com', password: 'saurab123' };
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send(loginDetail)
      .expect(201);

    accessToken = response.body.accessToken;
    userId = response.body.id;
    refreshToken = response.body.refreshToken;
    expect(response.body).toBeDefined();
  });

  it('should add a user', async () => {
    const newUser = {
      name: 'saurab sen',
      password: 'saurabsen123',
      email: 'saurabsen@gmail.com',
      role: 'admin',
    };
    const response = await request(app.getHttpServer())
      .post('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(newUser)
      .expect(HttpStatus.CREATED);
    console.log('first userId: ', userId);

    expect(response.body).toBeDefined();
  });

  it('should get all the users', async () => {
    const response = await request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .query({ searchKey: '', page: 1, pageSize: 5 })
      .expect(200);
    userId = response.body.data[1].id;
    expect(response.body).toBeDefined();
  });

  it('get a particular user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/user/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(HttpStatus.OK);

    userId = response.body.id;
    console.log('second userId: ', userId);
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

  it('should generate new tokens', async () => {
    const response = await request(app.getHttpServer())
      .post(`/user/generaterefresh`)
      .send({ refreshToken })
      .expect(201);

    expect(response.body).toBeDefined();
  });

  it('should delete a user', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/user/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });
});
