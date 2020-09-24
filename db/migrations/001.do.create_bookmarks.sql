CREATE TYPE star_rating AS ENUM ('1', '2', '3', '4', '5');

CREATE TABLE bookmarks (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title VARCHAR(50) NOT NULL,
  url VARCHAR(254) NOT NULL,
  description VARCHAR(500) NOT NULL,
  rating star_rating DEFAULT '1'
);