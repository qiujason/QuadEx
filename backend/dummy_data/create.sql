CREATE TABLE quads(
    name VARCHAR(30) PRIMARY KEY,
    dorms VARCHAR(30) [] UNIQUE
);

CREATE TABLE users(
    netID VARCHAR(8) PRIMARY KEY,
    password VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    year INTEGER NOT NULL,
    quad VARCHAR(30) REFERENCES quad(name),
    birthday TIMESTAMP,
    degree TEXT,
    hometown TEXT,
    bio TEXT
);

CREATE TABLE points(
    id SERIAL PRIMARY KEY,
    netID VARCHAR(8) references users(netID),
    time_stamp TIMESTAMP,
    point_value INTEGER,
    reason TEXT
);

CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location VARCHAR(30),
    time TIMESTAMP
);

CREATE TABLE event_interest(
    netID VARCHAR(8) references users(netID),
    event_id SERIAL references events(id),
    PRIMARY KEY(netID, event_id)
);