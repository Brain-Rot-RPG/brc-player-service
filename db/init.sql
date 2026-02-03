CREATE TABLE Player (
    id SERIAL PRIMARY KEY,
    level FLOAT,
    brainrotId INTEGER,
    inventory JSONB DEFAULT '{}',
    gold INTEGER
);