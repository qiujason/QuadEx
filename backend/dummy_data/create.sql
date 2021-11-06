CREATE TABLE quads(
    name VARCHAR(30) PRIMARY KEY,
    dorms VARCHAR(30) [] UNIQUE
);

CREATE TABLE users(
    net_id VARCHAR(30) PRIMARY KEY,
    password VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    birthday VARCHAR(8) NOT NULL,
    year INTEGER,
    hometown TEXT,
    quad VARCHAR(30) references quads(name),
    degree TEXT,
    bio TEXT,
    insta TEXT,
    bday_cal BOOLEAN DEFAULT TRUE NOT NULL
);

CREATE TABLE admin(
    username VARCHAR(30) PRIMARY KEY REFERENCES users(net_id),
    title VARCHAR(50) NOT NULL,
    email VARCHAR(50)
);

CREATE TABLE points(
    id SERIAL PRIMARY KEY,
    net_id VARCHAR(30) references users(net_id),
    date VARCHAR(30) NOT NULL,
    point_value INTEGER NOT NULL,
    reason TEXT NOT NULL
);

CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    time VARCHAR(4) NOT NULL,
    date VARCHAR(8) NOT NULL,
    description TEXT,
    location VARCHAR(30),
    tags VARCHAR(30) []
);

CREATE TABLE favorited_events(
    net_id VARCHAR(30) references users(net_id),
    event_id SERIAL references events(id),
    PRIMARY KEY(net_id, event_id)
);

CREATE TABLE quad_events(
    quad_name VARCHAR(30) references quads(name),
    event_id SERIAL references events(id),
    PRIMARY KEY(quad_name, event_id)
);

/* CREATE TABLE user_member_of(
    net_id VARCHAR(30) references users(net_id),
    quad_name VARCHAR(30) references quads(name),
    PRIMARY KEY(net_id, quad_name)
); */

CREATE TABLE points_earned_by(
    net_id VARCHAR(30) references users(net_id),
    points_id SERIAL references points(id),
    PRIMARY KEY(net_id, points_id)
);