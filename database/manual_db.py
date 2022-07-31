#!/usr/bin/env python3

import psycopg2, re

# connect to progression checker db
conn = psycopg2.connect(
    host="127.0.0.1",
    database="pc",
    user="maxowen")
cursor = conn.cursor()

cursor.execute(open("db_schema3.sql", "r").read())

cursor.execute(f"""INSERT INTO users(zid, name, is_staff)
                   VALUES ('z5263663', 'Max Owen', false)""")

cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc)
                   VALUES ('1', 'COMP1511', 'Programming Fundamentals', 2019, 6)""")
cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc)
                   VALUES ('2', 'COMP1521', 'Computer Systems Fundamentals', 2019, 6)""")
cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc)
                   VALUES ('3', 'COMP1531', 'Software Engineering Fundamentals', 2019, 6)""")
cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc)
                   VALUES ('4', 'ENGG1000', 'Introduction to Engineering Design and Innovation', 2019, 6)""")
cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc)
                   VALUES ('5', 'MATH1081', 'Discrete Mathematics', 2019, 6)""")
cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc)
                   VALUES ('6', 'MATH1131', 'Mathematics 1A', 2019, 6)""")
cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc)
                   VALUES ('7', 'MATH1141', 'Higher Mathematics 1A', 2019, 6)""")
cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc)
                   VALUES ('8', 'MATH1231', 'Mathematics 1B', 2019, 6)""")
cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc)
                   VALUES ('9', 'MATH1241', 'Higher Mathematics 1B', 2019, 6)""")
cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc)
                   VALUES ('10', 'COMP2521', 'Data Structures and Algorithms', 2020, 6)""")

cursor.execute(f"""INSERT INTO programs(program_id, year, code, title, total_uoc)
                   VALUES ('1', 2021, '3707', 'Engineering (Honours)', 192)""")

cursor.execute(f"""INSERT INTO streams(stream_id, year, code, title, total_uoc)
                   VALUES ('1', 2021, 'SENGAH', 'Software Engineering', 168)""")

cursor.execute(f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('1', '1', 'Stream', 'ST', 168, 168, 'AEROAH,BINFAH,CEICAH,CEICDH,COMPBH,CVENAH,CVENBH,ELECAH,MECHAH,SENGAH')""")

# cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
#                    VALUES ('1', '1', 'Level 1 Core Courses', 'CC', 42, 42, 'COMP1511,COMP1521,COMP1531,ENGG1000,MATH1081,{{MATH1131;MATH1141}},{{MATH1231;MATH1241}}')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('1', '1', 'Level 1 Core Courses', 'CC', 42, 42, 'COMP1511,COMP1521,COMP1531,ENGG1000,MATH1081,MATH1131,MATH1141,MATH1231,MATH1241')""")

cursor.execute(f"""INSERT INTO program_enrolments(zid, program_id)
                   VALUES ('z5263663', '1')""")

cursor.execute(f"""INSERT INTO stream_enrolments(zid, stream_id)
                   VALUES ('z5263663', '1')""")

cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5263663', '1', 84, 'DN')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5263663', '2', 77, 'DN')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5263663', '3', 85, 'HD')""")

cursor.close()
conn.commit()
conn.close()
