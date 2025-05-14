CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT
);

INSERT INTO users (name) VALUES
    ('Admin'),
    ('Helper'),
    ('User1'),
    ('User2');

CREATE TABLE IF NOT EXISTS races (
    id INTEGER PRIMARY KEY,
    name TEXT,
    owner INTEGER,
    start_time INTEGER DEFAULT 0,
    stopped_at INTEGER DEFAULT 0,
    stopped BOOLEAN DEFAULT TRUE,

    FOREIGN KEY (owner) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS checkpoints (
    id INTEGER PRIMARY KEY,
    race INTEGER,
    display TEXT,
    isend BOOLEAN DEFAULT 0 NOT NULL CHECK (isend IN (0, 1)),

    FOREIGN KEY (race) REFERENCES races (id)
);

CREATE TABLE IF NOT EXISTS user_races (
    user INTEGER,
    race INTEGER,
    role TEXT,

    FOREIGN KEY (user) REFERENCES users (id),
    FOREIGN KEY (race) REFERENCES races (id),
    PRIMARY KEY (user, race)
);

CREATE TABLE IF NOT EXISTS times (
    id INTEGER,
    time INTEGER,
    checkpoint INTEGER,
    FOREIGN KEY(checkpoint) REFERENCES checkpoints(id)
    PRIMARY KEY(id, checkpoint)
);

CREATE TABLE IF NOT EXISTS positions (
    id INTEGER,
    user INTEGER,
    race INTEGER,
    FOREIGN KEY(user) REFERENCES users(id),
    FOREIGN KEY(race) REFERENCES races(id),
    PRIMARY KEY (id, race),
    UNIQUE(user, race)
);

