import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import assert from 'assert';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let user = {
    "username":"test",
    "password":"12345678",
    "name":"abdo test"
  }
  let userAuth:string = "";
  let userTow = {
    "username":"test2",
    "password":"12345678",
    "name":"abdo test"
  }
  let userTowAuth:string = "";

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should register first user', async() => {
    const {body} = await request(app.getHttpServer())
      .post('/auth/register')
      .send(user)
      .set('Accept', 'application/json')
      .expect(201);
      userAuth = body.token  
       
      expect(body.username).not.toBe(user.username);
      expect(body.created).not.toBeNull();
  });

   it('Should delete first user', async() => {
    const {body} = await request(app.getHttpServer())
      .delete('/api/users')
      .set('Authorization', `Bearer ${userAuth}`)
      .set('Accept', 'application/json')
      .send()
      .expect(200);
      expect(body.message).not.toBeNull();
  }); 
 

   it('Should register a second user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userTow)
      .set('Accept', 'application/json')
      .expect(201);
  });

  it('Should fail registering second a user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userTow)
      .set('Accept', 'application/json')
      .expect(400);
  });

  it('Should login a second user', async() => {
    const {body} = await request(app.getHttpServer())
      .post('/auth/login')
      .send(userTow)
      .set('Accept', 'application/json')
      .expect(200);
      userTowAuth = body.token   
      expect(body.message).not.toBeNull();
  });
  it('Should delete second user', async() => {
    const {body} = await request(app.getHttpServer())
      .delete('/api/users')
      .set('Authorization', `Bearer ${userTowAuth}`)
      .set('Accept', 'application/json')
      .send()
      .expect(200);
      expect(body.message).not.toBeNull();
  }); 
});
