const knex = require('knex');
const app = require('../src/api/app');

const { bookmarks } = require('./store');

describe('Bookmarks endpoints ', function () {
  let db;

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('clean the table', () => db('bookmarks').truncate());

  afterEach('cleanup', () => db('bookmarks').truncate());

  describe('GET /bookmarks', () => {
    context('given no bookmarks', () => {

      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get('/bookmarks').expect(200, []);
      });
    });

    context('given there are bookmarks', () => {

      const testBookmarks = bookmarks();
      beforeEach('insert bookmarks', () => {
        return db.into('bookmarks').insert(testBookmarks);
      });

      it('responds with 200 and all of the articles', () => {
        return supertest(app).get('/bookmarks').expect(200, testBookmarks);
      });

      it('GET /bookmarks/:id responds with 200 and the specified article', () => {
        const id = 2
        const expectedBookmark = testBookmarks[id - 1]
        return supertest(app)
          .get(`/bookmarks/${id}`)
          .expect(200, expectedBookmark)
      })
    });
  });

  describe('POST /bookmarks', () => {
    context('given no bookmarks', () => {

      it('does a thing', () => {});
    });
  });

  describe('DELETE /bookmarks', () => {
    context('given there are bookmarks', () => {

      const testBookmarks = bookmarks();
      beforeEach('insert bookmarks', () => {
        return db.into('bookmarks').insert(testBookmarks);
      });

      it('does a thing', () => {});
    });
  });
});
