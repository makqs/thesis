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
    course_id VARCHAR,
    code VARCHAR,
    title VARCHAR,
    year int,
    uoc numeric,
    PRIMARY KEY (course_id)
);

CREATE TABLE programs (
    program_id VARCHAR,
    year int,
    code VARCHAR,
    title VARCHAR,
    total_uoc numeric,
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

CREATE TABLE academic_program_groups (
    apg_id VARCHAR,
    name VARCHAR,
    type VARCHAR,
    definition VARCHAR,
    PRIMARY KEY (apg_id)
);

CREATE TABLE academic_stream_groups (
    asg_id VARCHAR,
    name VARCHAR,
    type VARCHAR,
    definition VARCHAR,
    PRIMARY KEY (asg_id)
);

CREATE TABLE program_enrolments (
    zid VARCHAR,
    program_id VARCHAR,
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
    course_id VARCHAR,
    mark int,
    grade VARCHAR,
    FOREIGN KEY (zid) REFERENCES users(zid),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE program_rules (
    rule_id VARCHAR,
    apg_id VARCHAR,
    name VARCHAR,
    type VARCHAR,
    min_uoc numeric,
    max_uoc numeric,
    PRIMARY KEY (rule_id),
    FOREIGN KEY (apg_id) REFERENCES academic_program_groups(apg_id)
);

CREATE TABLE stream_rules (
    rule_id VARCHAR,
    asg_id VARCHAR,
    name VARCHAR,
    type VARCHAR,
    min_uoc numeric,
    max_uoc numeric,
    PRIMARY KEY (rule_id),
    FOREIGN KEY (asg_id) REFERENCES academic_stream_groups(asg_id)
);
