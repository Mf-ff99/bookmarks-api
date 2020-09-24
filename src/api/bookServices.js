const BookmarkServices = {
  getAllBookmarks(knex) {
    return knex.select('*').from('bookmarks')
  },

  getBookmarkById(knex, id) {
    return knex.select('*').from('bookmarks').where({ id }).first()
  },

  createBookmark(knex, newBookmark) {
    return knex
  },

  updateBookmarks(knex, id, newBookmark) {
    return knex
  },

  deleteBookmark(knex, id) {
    return knex.select('*').from('bookmarks').where({ id }).delete()
  }
}

module.exports = BookmarkServices;