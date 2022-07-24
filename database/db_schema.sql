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
    uoc int,
    PRIMARY KEY (course_id)
);

CREATE TABLE programs (
    program_id VARCHAR,
    year int,
    code VARCHAR,
    title VARCHAR,
    total_uoc int,
    PRIMARY KEY (program_id)
);

CREATE TABLE streams (
    stream_id VARCHAR,
    year int,
    code VARCHAR,
    title VARCHAR,
    total_uoc int,
    PRIMARY KEY (stream_id)
);

CREATE TABLE academic_object_groups (
    aog_id VARCHAR,
    name VARCHAR,
    type VARCHAR,
    definition VARCHAR,
    PRIMARY KEY (aog_id)
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

CREATE TABLE rules (
    rule_id VARCHAR,
    aog_id VARCHAR,
    parent_id VARCHAR,
    name VARCHAR,
    type VARCHAR,
    min_uoc int,
    max_uoc int,
    PRIMARY KEY (rule_id),
    FOREIGN KEY (aog_id) REFERENCES academic_object_groups(aog_id),
    FOREIGN KEY (parent_id) REFERENCES programs(program_id)
);
