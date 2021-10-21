CREATE TABLE quads(
    name VARCHAR(30) PRIMARY KEY,
    dorms VARCHAR(30) [] UNIQUE
);

CREATE TABLE users(
    netID VARCHAR(8) PRIMARY KEY,
    password VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    birthday TIMESTAMP NOT NULL,
    year INTEGER NOT NULL,
    hometown TEXT NOT NULL,
    quad VARCHAR(30) REFERENCES quad(name),
    degree TEXT,
    bio TEXT,
    insta TEXT,
    bday_cal BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE admin(
    username VARCHAR(8) PRIMARY KEY REFERENCES users(netID),
    title VARCHAR(50) NOT NULL,
    email VARCHAR(50),
)

CREATE TABLE points(
    id SERIAL PRIMARY KEY,
    netID VARCHAR(8) references users(netID),
    time_stamp TIMESTAMP NOT NULL,
    point_value INTEGER NOT NULL,
    reason TEXT NOT NULL
);

CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    time TIMESTAMP NOT NULL,
    description TEXT,
    location VARCHAR(30),
    tags VARCHAR(30) []
);

CREATE TABLE favorited_events(
    netID VARCHAR(8) references users(netID),
    event_id SERIAL references events(id),
    PRIMARY KEY(netID, event_id)
);

CREATE TABLE quad_events(
    quad_name VARCHAR(30) references quads(name),
    event_id SERIAL references events(id),
    PRIMARY KEY(quad_name, event_id)
);

CREATE TABLE user_member_of(
    netID VARCHAR(8) references users(netID),
    quad_name VARCHAR(30) references quads(name),
    PRIMARY KEY(netID, quad_name)
);

CREATE TABLE points_earned_by(
    netID VARCHAR(8) references users(netID),
    points_id SERIAL references points(id),
    PRIMARY KEY(netID, points_id)
);