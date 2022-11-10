DROP TABLE IF EXISTS stream_rules;
DROP TABLE IF EXISTS program_rules;
DROP TABLE IF EXISTS course_enrolments;
DROP TABLE IF EXISTS stream_enrolments;
DROP TABLE IF EXISTS program_enrolments;
DROP TABLE IF EXISTS academic_stream_groups;
DROP TABLE IF EXISTS academic_program_groups;
DROP TABLE IF EXISTS streams;
DROP TABLE IF EXISTS programs;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    zid VARCHAR,
    name VARCHAR,
    is_staff boolean,
    PRIMARY KEY (zid)
);

CREATE TABLE courses (
    course_id SERIAL,
    code VARCHAR,
    title VARCHAR,
    year int,
    uoc numeric,
    is_ge boolean,
    faculty VARCHAR,
    school VARCHAR,
    PRIMARY KEY (course_id)
);

CREATE TABLE programs (
    program_id SERIAL,
    year int,
    code VARCHAR,
    title VARCHAR,
    total_uoc numeric,
    faculty VARCHAR,
    school VARCHAR,
    PRIMARY KEY (program_id)
);

CREATE TABLE streams (
    stream_id VARCHAR,
    year int,
    code VARCHAR,
    title VARCHAR,
    total_uoc numeric,
    PRIMARY KEY (stream_id)
);

CREATE TABLE program_enrolments (
    zid VARCHAR,
    program_id INTEGER,
    FOREIGN KEY (zid) REFERENCES users(zid),
    FOREIGN KEY (program_id) REFERENCES programs(program_id)
);

CREATE TABLE stream_enrolments (
    zid VARCHAR,
    stream_id VARCHAR,
    FOREIGN KEY (zid) REFERENCES users(zid),
    FOREIGN KEY (stream_id) REFERENCES streams(stream_id)
);

CREATE TABLE course_enrolments (
    zid VARCHAR,
    course_id INTEGER,
    mark int,
    grade VARCHAR,
    FOREIGN KEY (zid) REFERENCES users(zid),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE program_rules (
    program_rule_id VARCHAR,
    program_id SERIAL,
    name VARCHAR,
    type VARCHAR,
    uoc numeric,
    definition VARCHAR,
    PRIMARY KEY (program_rule_id),
    FOREIGN KEY (program_id) REFERENCES programs(program_id)
);

CREATE TABLE stream_rules (
    stream_rule_id SERIAL,
    stream_id VARCHAR,
    name VARCHAR,
    type VARCHAR,
    uoc numeric,
    definition VARCHAR,
    PRIMARY KEY (stream_rule_id),
    FOREIGN KEY (stream_id) REFERENCES streams(stream_id)
);
