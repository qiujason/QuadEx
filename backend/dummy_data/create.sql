CREATE TABLE images(
    filename TEXT PRIMARY KEY NOT NULL,
    filepath TEXT NOT NULL,
    mimetype TEXT NOT NULL,
    size BIGINT NOT NULL
);

CREATE TABLE quads(
    name VARCHAR(30) PRIMARY KEY,
    dorms VARCHAR(30) [] UNIQUE,
    pic VARCHAR(30) REFERENCES images(filename)
);

CREATE TABLE users(
    net_id VARCHAR(30) PRIMARY KEY,
    password VARCHAR(30) NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    birthday VARCHAR(8) NOT NULL,
    year INTEGER,
    hometown TEXT,
    quad VARCHAR(30) REFERENCES quads(name),
    degree TEXT,
    bio TEXT,
    insta TEXT,
    bday_cal BOOLEAN DEFAULT TRUE NOT NULL,
    prof_pic VARCHAR(30) REFERENCES images(filename)
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
    end_time VARCHAR(4) NOT NULL,
    end_date VARCHAR(8) NOT NULL,
    description TEXT,
    location VARCHAR(30),
    tags VARCHAR(30) [],
    pic VARCHAR(30) REFERENCES images(filename)
);

CREATE TABLE favorited_events(
    net_id VARCHAR(30) REFERENCES users(net_id),
    event_id SERIAL REFERENCES events(id),
    PRIMARY KEY(net_id, event_id)
);

CREATE TABLE quad_events(
    quad_name VARCHAR(30) REFERENCES quads(name),
    event_id SERIAL REFERENCES events(id),
    PRIMARY KEY(quad_name, event_id)
);

CREATE TABLE quad_admins(
    quad_name VARCHAR(30) REFERENCES quads(name),
    admin VARCHAR(30) REFERENCES admin(username),
    PRIMARY KEY(quad_name, admin)
);

CREATE FUNCTION TF_DeleteEvents() RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM favorited_events WHERE OLD.id = favorited_events.event_id;
  DELETE FROM quad_events WHERE OLD.id = quad_events.event_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER TG_DeleteEvents
  BEFORE DELETE ON events
  FOR EACH ROW
  EXECUTE PROCEDURE TF_DeleteEvents();