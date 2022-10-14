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
                   VALUES ('z5555555', 'Sam Student', false)""")
cursor.execute(f"""INSERT INTO users(zid, name, is_staff)
                   VALUES ('z5263663', 'Max Owen', false)""")
cursor.execute(f"""INSERT INTO users(zid, name, is_staff)
                   VALUES ('z5166214', 'Benjamin Brown', false)""")
cursor.execute(f"""INSERT INTO users(zid, name, is_staff)
                   VALUES ('z6666666', 'Liam Lecturer', true)""")

with open("../backend/courses.txt", "r") as f:
    for index, line in enumerate(f.readlines(), 1):
        line = re.sub(r"'", r"''", line)
        (code, title, uoc, gened, faculty, school) = line.strip().split('_', 5)
        print(code, title, uoc, gened, faculty, school)
        if uoc == "":
            uoc = "0"
        cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
                        VALUES ('{index}', '{code}', '{title}', 2021, {int(uoc)}, {gened})""")

# gen eds is by the faculty
# need to store school and faculty from the API in the courses
# also need to store school of program
# if not gen ed or same faculty -> cant be taken as gen ed
# if not gen ed or different faculty but part of exception schools (math + infs) -> cant be taken as gen ed
# https://www.handbook.unsw.edu.au/api/content/render/false/query/+contentType:unsw_psubject%20+unsw_psubject.studyLevelURL:undergraduate%20+unsw_psubject.implementationYear:2021%20+unsw_psubject.code:COMP1521%20+deleted:false%20+working:true%20+live:true%20+languageId:1%20/orderBy/modDate%20desc

# https://www.handbook.unsw.edu.au/api/content/render/false/query/+contentType:unsw_pcourse%20+unsw_pcourse.studyLevelURL:undergraduate%20+unsw_pcourse.implementationYear:2021%20+deleted:false/limit/1

# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('1', 'COMP1511', 'Programming Fundamentals', 2019, 6, true)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('2', 'COMP1521', 'Computer Systems Fundamentals', 2019, 6, true)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('3', 'COMP1531', 'Software Engineering Fundamentals', 2019, 6, true)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('4', 'ENGG1000', 'Introduction to Engineering Design and Innovation', 2019, 6, true)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('5', 'MATH1081', 'Discrete Mathematics', 2019, 6, true)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('6', 'MATH1131', 'Mathematics 1A', 2019, 6, true)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('7', 'MATH1141', 'Higher Mathematics 1A', 2019, 6, true)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('8', 'MATH1231', 'Mathematics 1B', 2019, 6, true)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('9', 'MATH1241', 'Higher Mathematics 1B', 2019, 6, true)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('10', 'COMP2041', 'Software Construction: Techniques and Tools', 2020, 6, true)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('11', 'COMP2511', 'Object-Oriented Design & Programming', 2020, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('12', 'COMP2521', 'Data Structures and Algorithms', 2019, 6, true)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('13', 'DESN2000', 'Engineering Design and Professional Practice', 2020, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('14', 'MATH2400', 'Finite Mathematics', 2020, 3, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('15', 'MATH2859', 'Probability, Statistics and Information', 2020, 3, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('16', 'SENG2011', 'Workshop on Reasoning about Programs', 2020, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('17', 'SENG2021', 'Requirements and Design Workshop', 2020, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('18', 'COMP3141', 'Software System Design and Implementation', 2021, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('19', 'COMP3311', 'Database Systems', 2020, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('20', 'COMP3331', 'Computer Networks and Applications', 2020, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('21', 'SENG3011', 'Software Engineering Workshop 3', 2021, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('22', 'SENG4920', 'Ethics and Management', 2022, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('23', 'COMP4951', 'Research Thesis A', 2022, 4, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('24', 'COMP4952', 'Research Thesis B', 2022, 4, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('25', 'COMP4953', 'Research Thesis C', 2022, 4, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('26', 'ENGG2600', 'Engineering Vertically Integrated Project', 2022, 2, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('27', 'ENGG3600', 'Engineering Vertically Integrated Project', 2022, 2, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('28', 'ENGG4600', 'Engineering Vertically Integrated Project', 2022, 2, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('29', 'ENGG3060', 'Maker Games', 2022, 3, false)""")

# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('30', 'ARTS2511', 'Intermediate German B', 2022, 6, true)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('31', 'COMP3421', 'Computer Graphics', 2021, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('32', 'COMP6771', 'Advanced C++ Programming', 2021, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('33', 'PHYS1160', 'Introduction to Astronomy', 2022, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('34', 'MATH3411', 'Information, Codes and Ciphers', 2022, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('35', 'ARTS3510', 'Advanced German A', 2022, 6, true)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('36', 'ECON1101', 'Microeconomics', 2022, 6, false)""")
# cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge)
#                    VALUES ('37', 'COMP3231', 'Operating Systems', 2021, 6, false)""")

# cursor.execute(f"""INSERT INTO programs(program_id, year, code, title, total_uoc)
#                    VALUES ('1', 2021, '3707', 'Engineering (Honours)', 192)""")
with open("../backend/programs.txt", "r") as f:
    for index, line in enumerate(f.readlines(), 1):
        line = re.sub(r"'", r"''", line)
        (code, title, year, total_uoc, faculty, school) = line.strip().split('_', 5)
        print(code, title, year, total_uoc, faculty, school)
        cursor.execute(f"""INSERT INTO programs(program_id, year, code, title, total_uoc)
                        VALUES ('{index}', {int(year)}, '{code}', '{title}', {int(total_uoc)})""")

cursor.execute(f"""INSERT INTO streams(stream_id, year, code, title, total_uoc)
                   VALUES ('1', 2021, 'SENGAH', 'Software Engineering', 168)""")

cursor.execute(f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('1', '97', 'Stream', 'ST', 168, 168, 'AEROAH,BINFAH,CEICAH,CEICDH,COMPBH,CVENAH,CVENBH,ELECAH,MECHAH,SENGAH')""")
cursor.execute(f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('2', '97', 'General Education', 'GE', 12, 12, '')""")
cursor.execute(f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('3', '97', 'Discipline Electives', 'DE', 12, 12, 'REFER:ST,DE')""")

# cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
#                    VALUES ('1', '1', 'Level 1 Core Courses', 'CC', 42, 42, 'COMP1511,COMP1521,COMP1531,ENGG1000,MATH1081,{{MATH1131;MATH1141}},{{MATH1231;MATH1241}}')""")
# cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
#                    VALUES ('1', '1', 'Level 1 Core Courses', 'CC', 42, 42, 'COMP1511,COMP1521,COMP1531,ENGG1000,MATH1081,MATH1131;MATH1141,MATH1231;MATH1241')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('1', '1', 'Level 1 Core Courses', 'CC', 42, 42, 'COMP1511,COMP1521,COMP1531,ENGG1000,MATH1081,MATH1131,MATH1141,MATH1231,MATH1241')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('2', '1', 'Level 2 Core Courses', 'CC', 42, 42, 'COMP2041,COMP2511,COMP2521,DESN2000,MATH2400,MATH2859,SENG2011,SENG2021')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('3', '1', 'Level 3 Core Courses', 'CC', 24, 24, 'COMP3141,COMP3311,COMP3331,SENG3011')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('4', '1', 'Level 4 Core Courses', 'CC', 18, 18, 'SENG4920,COMP4951,COMP4952,COMP4953')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('5', '1', 'Discipline Electives', 'DE', 36, 36, 'ENGG2600,ENGG3600,ENGG4600,COMP3XXX,COMP4XXX,COMP6XXX,COMP9XXX,INFS3XXX,INFS4XXX,MATH3XXX,MATH4XXX,MATH6XXX,ELEC3XXX,ELEC4XXX,TELE3XXX,TELE4XXX')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('6', '1', 'Free Electives', 'FE', 6, NULL, NULL)""")

cursor.execute(f"""INSERT INTO program_enrolments(zid, program_id)
                   VALUES ('z5555555', '97')""")

cursor.execute(f"""INSERT INTO stream_enrolments(zid, stream_id)
                   VALUES ('z5555555', '1')""")

cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '891', 84, 'DN')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '892', 77, 'DN')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '893', 85, 'FL')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '2005', 78, 'DN')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '235', 80, 'DN')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '2029', 84, 'DN')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '952', 96, 'HD')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '2424', 60, 'PS')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '898', 70, 'CF')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '912', 76, 'DN')""")

cursor.close()
conn.commit()
conn.close()
