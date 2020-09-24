const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
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
    context(`Given an XSS attack article`, () => {
      const maliciousArticle = {
        id: 911,
        title: '<script>alert("xss");</script>',
        url: 'How-to',
        description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
        rating: '3'
      };

      beforeEach('insert malicious article', () => {
        return db.into('bookmarks').insert([maliciousArticle]);
      });

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/bookmarks/${maliciousArticle.id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.title).to.eql(
              '&lt;script&gt;alert("xss");&lt;/script&gt;'
            );
            expect(res.body.description).to.eql(
              `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
            );
          });
      });
    });

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
        const id = 2;
        const expectedBookmark = testBookmarks[id - 1];
        return supertest(app)
          .get(`/bookmarks/${id}`)
          .expect(200, expectedBookmark);
      });
    });
  });

  describe('POST /bookmarks', () => {
    context('given no bookmarks', () => {
      it('does a thing', () => {
        const testBookmarks = bookmarks();
        const newBookmark = testBookmarks[0];

        return supertest(app)
          .post('/bookmarks')
          .send(newBookmark)
          .expect(201)
          .then(() => supertest(app).get('/bookmarks').expect([newBookmark]));
      });
    });
  });

  describe('DELETE /bookmarks', () => {
    context('given there are bookmarks', () => {
      const testBookmarks = bookmarks();
      beforeEach('insert bookmarks', () => {
        return db.into('bookmarks').insert(testBookmarks);
      });

      it('deletes book by ID', () => {
        const id = 2;
        const testBookmarks = bookmarks();
        const expectedResults = testBookmarks.filter((book) => book.id !== id);

        return supertest(app)
          .delete(`/bookmarks/${id}`)
          .expect(204)
          .then(() => supertest(app).get('/bookmarks').expect(expectedResults));
      });
    });
  });
});
