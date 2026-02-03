CREATE TABLE Player (
    id SERIAL PRIMARY KEY,
    level FLOAT,
    brainrotId INTEGER,
    inventory INTEGER[],
    gold INTEGER
);