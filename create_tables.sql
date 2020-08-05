CREATE TABLE roles (
    id int NOT NULL,
    name varchar(24) NOT NULL
);

CREATE TABLE users (
    id int NOT NULL,
    handle varchar(60) NOT NULL,
    first_name varchar(60) NOT NULL,
    last_name varchar(60) NOT NULL,
    email_address varchar(255) NOT NULL,
    fb_access_token varchar(255)
);

CREATE TABLE user_role (
    id int NOT NULL,
    user_id int NOT NULL,
    role_id int NOT NULL
);

CREATE TABLE characters (
    id int NOT NULL,
    user_id int NOT NULL,
    dndbeyond_url varchar(255)
);

CREATE TABLE games (
    id int NOT NULL,
    title varchar(255),
    description text(65535),
    start DATETIME,
    end DATETIME,
    host_id int NOT NULL,
    max_number_of_players int,
    min_character_level int,
    max_character_level int
);

CREATE TABLE rsvps (
    id int NOT NULL,
    game_id int NOT NULL,
    user_id int NOT NULL,
    created_at DATETIME
);