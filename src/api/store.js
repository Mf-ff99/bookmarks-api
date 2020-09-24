const { v4: uuid } = require('uuid');

const bookmarks = [
  { id: uuid(),
    title: 'Thinkful',
    url: 'https://www.thinkful.com',
    description: 'bootcamp stuff',
    rating: 5 },
  { id: uuid(),
    title: 'Google',
    url: 'https://www.google.com',
    description: 'google stuff',
    rating: 5 },
  { id: uuid(),
    title: 'Facebook',
    url: 'https://www.facebook.com',
    description: 'face and book stuff',
    rating: 5 },
]

module.exports = { bookmarks }