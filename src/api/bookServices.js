const BookmarkServices = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmarks');
  },

  getBookmarkById(knex, id) {
    return knex.select('*').from('bookmarks').where({ id }).first();
  },

  createBookmark(knex, newBookmark) {
    return knex
      .insert(newBookmark)
      .into('bookmarks')
      .then((bookmark) => bookmark[bookmark.length - 1]);
  },

  deleteBookmark(knex, id) {
    return knex.select('*').from('bookmarks').where({ id }).delete();
  },

  updateBookmark(knex, id, newBookmark) {
    return knex.select('*').from('bookmarks').where({ id }).update(newBookmark);
  }
};

module.exports = BookmarkServices;
