import { Container } from 'typedi';
import { setUp, tearDown } from '../hooks';
import { Db } from '../../../src/db/db';

beforeEach(setUp);

afterEach(tearDown);

describe('Db', () => {
  describe('DefaultApi', () => {
    describe('isUp', () => {
      it("must return <true> when it's up", async () => {
        const db = Container.get(Db.token);
        expect(await db.isUp()).toBe(true);
      });
    });
  });
});
