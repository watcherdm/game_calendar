CREATE TABLE roles (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(24) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO roles (id, name) VALUES (null, 'admin');
INSERT INTO roles (id, name) VALUES (null, 'chapter');
INSERT INTO roles (id, name) VALUES (null, 'player');

CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT,
    handle varchar(60) NOT NULL,
    first_name varchar(60) NOT NULL,
    last_name varchar(60) NOT NULL,
    email_address varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    fb_access_token varchar(255),
    PRIMARY KEY (id)
);

INSERT INTO users (id, handle, first_name, last_name, email_address, password, fb_access_token) VALUES (null, 'watcher', 'Gabriel', 'Hernandez', 'watcher.gabriel.joshua@gmail.com', PASSWORD('test'), null);

CREATE TABLE user_role (
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    role_id int NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO user_role (id, user_id, role_id) VALUES (null, 1, 1);

CREATE TABLE characters (
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    dndbeyond_url varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE games (
    id int NOT NULL AUTO_INCREMENT,
    title varchar(255),
    description text(65535),
    start DATETIME,
    end DATETIME,
    host_id int NOT NULL,
    max_number_of_players int,
    min_character_level int,
    max_character_level int,
    PRIMARY KEY (id)
);

CREATE TABLE rsvps (
    id int NOT NULL AUTO_INCREMENT,
    game_id int NOT NULL,
    user_id int NOT NULL,
    created_at DATETIME,
    PRIMARY KEY (id)
);