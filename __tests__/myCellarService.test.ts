import { getDocs } from 'firebase/firestore';
import { QueryDocumentSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { jest, expect } from '@jest/globals';
import { describe, it } from 'node:test';
import { getMyCellarWinesService } from '../src/services/myCellarService';

// Funzione helper per creare mock di QueryDocumentSnapshot
function createMockDocumentSnapshot(data: any): QueryDocumentSnapshot<unknown, DocumentData> {
  return {
    data: () => data,
    id: data.id || 'mock-id',
    ref: {} as any,
    metadata: { hasPendingWrites: false, fromCache: false },
    exists: () => true,
    get: (fieldPath: string) => data[fieldPath]
  } as QueryDocumentSnapshot<unknown, DocumentData>;
}

// Mock di getDocs
jest.mock('firebase/firestore', () => ({
  ...jest.requireActual('firebase/firestore'),
  getDocs: jest.fn()
}));

describe('getMyCellarWinesService', () => {
  it('should return wines for a given user ID', async () => {
    // Utilizzo della funzione helper per creare i mock
    const mockDocs = [
      createMockDocumentSnapshot({ id: '1', name: 'Wine A' }),
      createMockDocumentSnapshot({ id: '2', name: 'Wine B' })
    ];
    
    // Creo il mock della risposta di getDocs
    (getDocs as jest.MockedFunction<typeof getDocs>).mockResolvedValue({
      docs: mockDocs
    } as unknown as QuerySnapshot<unknown, DocumentData>);

    // Chiamo la funzione da testare
    const wines = await getMyCellarWinesService('test-uid');
    
    // Verifico i risultati
    expect(wines).toEqual([{ id: '1', name: 'Wine A' }, { id: '2', name: 'Wine B' }]);
    expect(getDocs).toHaveBeenCalledTimes(1);
  });
});