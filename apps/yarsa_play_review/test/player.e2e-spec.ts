import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { faker } from '@faker-js/faker';

describe('PlayerController E2E test (e2e)', () => {
  let app: INestApplication;
  let accessToken;
  let playerId;
  const newPlayer = {
    name: 'saurabsen',
    email: 'saurabsen@gmail.com',
    password: 'saurabsen123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  it('should create a new player', async () => {
    const response = await request(app.getHttpServer())
      .post('/player')
      .send(newPlayer)
      .expect(201);

    playerId = response.body.id;
    accessToken = response.body.accessToken;
    expect(response.body).toBeDefined();
  });
  it('should login the player', async () => {
    const response = await request(app.getHttpServer())
      .post('/player')
      .send({ email: newPlayer.email, password: newPlayer.password })
      .expect(201);

    expect(response.body).toBeDefined();
  });
  it('should get a player', async () => {
    const response = await request(app.getHttpServer())
      .get(`/player/${playerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });
  it('should play the game', async () => {
    const response = await request(app.getHttpServer())
      .get(`/player/play/${playerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toBeDefined();
  });
  it('should update the player', async () => {
    const response = await request(app.getHttpServer())
      .put(`/player/${playerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ name: faker.person.fullName(), email: faker.internet.email() })
      .expect(200);

    expect(response.body).toBeDefined();
  });
  it('should delete a player', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/player/${playerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);
    expect(response.body).toBeDefined();
  });
});
