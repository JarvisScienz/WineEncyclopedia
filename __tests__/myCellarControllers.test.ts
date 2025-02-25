import request from 'supertest';
import app from '../src/index';
import { getMyCellarWinesService } from '../src/services/myCellarService';
import { jest, expect } from '@jest/globals';

jest.mock('../src/services/myCellarService');

jest.mock('../src/config/firebaseConfig.json', () => ({
    apiKey: 'test-api-key',
    authDomain: 'test-auth-domain',
    // altre proprietà necessarie...
  }), { virtual: true });

  jest.mock('firebase/firestore', () => {
    return {
      getFirestore: jest.fn(() => ({})), // Restituisce un oggetto vuoto per evitare errori
      collection: jest.fn(() => 'mockedCollection'),
      query: jest.fn(() => 'mockedQuery'),
      where: jest.fn(() => 'mockedWhere'),
      getDocs: jest.fn(),
    };
  });

describe('POST /api/myCellarWines', () => {
  it('should return a list of wines for a given user ID', async () => {
    jest.mock('../src/services/myCellarService', () => ({
        getMyCellarWinesService: jest.fn() as jest.MockedFunction<typeof getMyCellarWinesService>
      }));
      
      (getMyCellarWinesService as jest.MockedFunction<typeof getMyCellarWinesService>).mockResolvedValue([
        { id: '1', name: 'Wine A' },
        { id: '2', name: 'Wine B' },
      ]);

    const response = await request(app)
      .post('/api/myCellarWines')
      .send({ uid: 'test-uid' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: '1', name: 'Wine A' }, { id: '2', name: 'Wine B' }]);
  });

  it('should return 422 if UID is missing', async () => {
    const response = await request(app).post('/api/myCellarWines').send({});

    expect(response.status).toBe(422);
    expect(response.body).toEqual({ uid: "UID is required" });
  });
});
