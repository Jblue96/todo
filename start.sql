-- used to create my columns

CREATE TABLE tasks (
	id SERIAL PRIMARY KEY NOT NULL,
	task VARCHAR(50),
	completed BOOLEAN
);
