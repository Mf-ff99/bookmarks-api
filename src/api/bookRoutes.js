const express = require('express');
const xss = require('xss');
const logger = require('../../src/libs/logger');
const BookServices = require('./bookServices');

const bookmarksRouter = express.Router();

const regEx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%\+.~#?&//=]*)/;

bookmarksRouter
  .route('/')
  .get((req, res, next) => {
    BookServices.getAllBookmarks(req.app.get('db'))
      .then((bookmarks) => res.status(200).json(bookmarks))
      .catch(next);
  })

  .post((req, res, next) => {
    const { title, url, description, rating } = req.body;
    const newBookmark = {
      title,
      url,
      description,
      rating
    };
    if (!url || !url.match(regEx)) {
      logger.error(`Url is required`);
      return res.status(400).send('Invalid data');
    }

    BookServices.createBookmark(req.app.get('db'), newBookmark)
      .then((bookmark) => res.status(201).json(bookmark))
      .catch(next);
  });

bookmarksRouter
  .route('/:id')
  .all((req, res, next) => {
    BookServices.getBookmarkById(req.app.get('db'), req.params.id)
      .then((bookmark) => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: `Bookmark doesn't exist` }
          });
        }
        res.bookmark = bookmark; // save the article for the next middleware
        next(); // don't forget to call next so the next middleware happens!
      })
      .catch(next);
  })

  .get((req, res) => {
    res.json({
      id: res.bookmark.id,
      title: xss(res.bookmark.title),
      url: xss(res.bookmark.url),
      description: xss(res.bookmark.description),
      rating: res.bookmark.rating
    });
  })

  .delete((req, res, next) => {
    BookServices.deleteBookmark(req.app.get('db'), req.params.id)
      .then(() => res.status(204).end())
      .catch(next);
  })

  .patch((req, res, next) => {
    const { title, url, description, rating } = req.body;
    const newBookmark = { title, url, description, rating }

    BookServices.updateBookmark(req.app.get('db'), req.params.id, newBookmark)
      .then(() => res.status(204).end())
      .catch(next);
  });

// .post(bodyParser, (req, res) => {
//   const { title, url, description, rating } = req.body;

//   if (!title || title.length < 1) {
//     logger.error(`Title is required`);
//     return res.status(400).send('Invalid data');
//   }
//   if (!url || !url.match(regEx)) {
//     logger.error(`Url is required`);
//     return res.status(400).send('Invalid data');
//   }
//   if (!description || description.length < 3) {
//     logger.error(`description is required(atleast 3 chars)`);
//     return res.status(400).send('Invalid data');
//   }
//   if (!rating || rating < 1 || rating > 5 || typeof rating !== 'number') {
//     logger.error(`rating is required`);
//     return res.status(400).send('Invalid data');
//   }

//   const id = uuid();

//   const newBookmark = {
//     id,
//     title,
//     url,
//     description,
//     rating
//   };

//   store.push(newBookmark);

//   // res.send('it worked!!!!!!')
//   return res
//     .status(201)
//     .location(`http://localhost:8000/bookmarks/${id}`)
//     .json({ newBookmark, message: 'it worked!' });
//   // .json(newBookmark)
// });

// ----------------------------------------------

// .delete((req, res) => {
//   const { id } = req.params;

//   const bookmarkIndex = store.findIndex((b) => b.id === id);

//   if (bookmarkIndex === -1) {
//     logger.error(`Bookmark with id ${id} not found.`);
//     return res.status(404).send('Bookmark not found');
//   }

//   store.splice(bookmarkIndex, 1);

//   logger.info(`Bookmark with id ${id} deleted.`);

//   return res.status(204).end();
// });

module.exports = bookmarksRouter;
