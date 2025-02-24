import request from 'supertest';
import app from '../src/index.js'; // Assumo che il tuo Express app sia esportato da `app.ts`
import { getMyCellarWinesService } from '../src/services/myCellarService';
import { describe, it } from 'node:test';
import { jest, expect } from '@jest/globals';

jest.mock('../services/myCellarService');

describe('GET /my-cellar-wines', () => {
  it('should return a list of wines for a given user ID', async () => {
    jest.mock('../services/myCellarService', () => ({
        getMyCellarWinesService: jest.fn() as jest.MockedFunction<typeof getMyCellarWinesService>
      }));
      
      (getMyCellarWinesService as jest.MockedFunction<typeof getMyCellarWinesService>).mockResolvedValue([
        { id: '1', name: 'Wine A' },
        { id: '2', name: 'Wine B' },
      ]);

    const response = await request(app)
      .get('/api/myCellarWines') // Assumendo che questa sia la tua rotta
      .send({ uid: 'test-uid' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: '1', name: 'Wine A' }, { id: '2', name: 'Wine B' }]);
  });

  it('should return 422 if UID is missing', async () => {
    const response = await request(app).get('/api/myCellarWines').send({});

    expect(response.status).toBe(422);
    expect(response.body).toEqual({ uid: "UID is required" });
  });
});
