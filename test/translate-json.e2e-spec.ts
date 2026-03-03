import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import longJson from './samples/bigjson.json';
import express from 'express';
import anotherJson from './samples/another.json';
import fs from 'fs';

describe('/translator/json', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      express.urlencoded({
        extended: true,
        limit: '50mb',
      }),
    );
    app.use(
      express.json({
        limit: '50mb',
      }),
    );
    await app.init();
  });

  it.only('Can translate long json', async () => {
    const res = await request(app.getHttpServer())
      .post('/translator/json')
      .send({
        json: longJson,
        from: 'en',
        to: 'zh',
      });
    expect(res.statusCode).toEqual(200);
    fs.writeFileSync('output.json', JSON.stringify(res.body.trans));
  });
  it('Can translate long json 2', async () => {
    const res = await request(app.getHttpServer())
      .post('/translator/json')
      .send({
        json: anotherJson,
        from: 'en',
        to: 'bg',
      });
    expect(res.statusCode).toEqual(200);
    // fs.writeFileSync('output.json', JSON.stringify(res.body.trans));
  });
});
