import { Server } from 'http';
import request from 'supertest';
import { app } from '../index';
import db from '../models';
import { startServer, stopServer } from '../index';

let server: Server;

beforeAll(async () => {
  await db.sequelize.sync({ force: true });
  server = await startServer();
});

afterAll(async () => {
  await stopServer();
});

describe('GET /', () => {
  it('should return status 200 and "healthy server..."', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('healthy server...');
  });
});