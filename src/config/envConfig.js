module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  DB_URL:process.env.DB_URL || "postgresql://dunder_mifflin@localhost/bookmarks"
};
