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
        print(index, code, title, uoc, gened, faculty, school)
        if uoc == "":
            uoc = "0"
        cursor.execute(f"""INSERT INTO courses(course_id, code, title, year, uoc, is_ge, faculty, school)
                        VALUES ('{index}', '{code}', '{title}', 2021, {int(uoc)}, {gened}, '{faculty}', '{school}')""")

# gen eds is by the faculty
# need to store school and faculty from the API in the courses
# also need to store school of program
# if not gen ed or same faculty -> cant be taken as gen ed
# if not gen ed or different faculty but part of exception schools (math + infs) -> cant be taken as gen ed
# https://www.handbook.unsw.edu.au/api/content/render/false/query/+contentType:unsw_psubject%20+unsw_psubject.studyLevelURL:undergraduate%20+unsw_psubject.implementationYear:2021%20+unsw_psubject.code:COMP1521%20+deleted:false%20+working:true%20+live:true%20+languageId:1%20/orderBy/modDate%20desc

# https://www.handbook.unsw.edu.au/api/content/render/false/query/+contentType:unsw_pcourse%20+unsw_pcourse.studyLevelURL:undergraduate%20+unsw_pcourse.implementationYear:2021%20+deleted:false/limit/1

with open("../backend/programs.txt", "r") as f:
    for index, line in enumerate(f.readlines(), 1):
        line = re.sub(r"'", r"''", line)
        (code, title, year, total_uoc, faculty, school) = line.strip().split('_', 5)
        print(index, code, title, year, total_uoc, faculty, school)
        cursor.execute(f"""INSERT INTO programs(program_id, year, code, title, total_uoc, faculty, school)
                        VALUES ('{index}', {int(year)}, '{code}', '{title}', {int(total_uoc)}, '{faculty}', '{school}')""")

cursor.execute(f"""INSERT INTO streams(stream_id, year, code, title, total_uoc)
                   VALUES ('1', 2021, 'SENGAH', 'Software Engineering', 168)""")
cursor.execute(f"""INSERT INTO streams(stream_id, year, code, title, total_uoc)
                   VALUES ('2', 2021, 'ELECAH', 'Electrical Engineering', 168)""")
cursor.execute(f"""INSERT INTO streams(stream_id, year, code, title, total_uoc)
                   VALUES ('3', 2021, 'AEROAH', 'Aerospace Engineering', 168)""")

cursor.execute(f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('1', '97', 'Stream', 'ST', 168, 168, 'AEROAH,BINFAH,CEICAH,CEICDH,COMPBH,CVENAH,CVENBH,ELECAH,MECHAH,SENGAH')""")
cursor.execute(f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('2', '97', 'General Education', 'GE', 12, 12, NULL)""")
cursor.execute(f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('3', '97', 'Discipline Electives', 'DE', 12, 12, 'ENGG2600,ENGG3600,ENGG4600,COMP3XXX,COMP4XXX,COMP6XXX,COMP9XXX,INFS3XXX,INFS4XXX,MATH3XXX,MATH4XXX,MATH6XXX,ELEC3XXX,ELEC4XXX,TELE3XXX,TELE4XXX')""")
# cursor.execute(f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition)
#                    VALUES ('3', '97', 'Discipline Electives', 'DE', 12, 12, 'REFER:ST,DE')""")

cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('1', '1', 'Level 1 Core Courses', 'CC', 42, 42, 'COMP1511,COMP1521,COMP1531,ENGG1000,MATH1081,MATH1131;MATH1141,MATH1231;MATH1241')""")
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

# ELECAH stream
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('7', '2', 'Level 1 Core Courses', 'CC', 48, 48, 'COMP1521,ELEC1111,ENGG1000,PHYS1231,MATH1131;MATH1141,MATH1231;MATH1241,PHYS1121;PHYS1131,COMP1511;COMP1911')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('8', '2', 'Level 2 Core Courses', 'CC', 36, 36, 'DESN2000,ELEC2133,ELEC2134,ELEC2141,MATH2069,MATH2099')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('9', '2', 'Level 3 Core Courses', 'CC', 42, 42, 'ELEC3104,ELEC3105,ELEC3106,ELEC3114,ELEC3115,ELEC3117,TELE3113')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('10', '2', 'Level 4 Core Courses', 'CC', 24, 24, 'ELEC4122,ELEC4123,ELEC4951,ELEC4952,ELEC4953')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('11', '2', 'Breadth Electives', 'DE', 6, 6, 'COMP2041,COMP3211,COMP3231,ELEC2146,ELEC3111,ELEC3145,ELEC3705,ENGG2600,ENGG3001,ENGG3060,ENGG3600,ENGG4060,ENGG4102,ENGG4600,MATH3101,MATH3121,MATH3161,MATH3201,MATH3261,MATH3411,TELE3118,TELE3119')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('12', '2', 'Discipline Electives', 'DE', 12, 12, 'ELEC4445,ELEC4601,ELEC4602,ELEC4603,ELEC4604,ELEC4605,ELEC4611,ELEC4612,ELEC4613,ELEC4614,ELEC4617,ELEC4621,ELEC4622,ELEC4623,ELEC4631,ELEC4632,ELEC4633,PHTN4661,PHTN4662,TELE4642,TELE4651,TELE4652,TELE4653')""")

# AEROH stream
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('13', '3', 'Level 1 Core Courses', 'CC', 48, 48, 'ELEC1111,ENGG1000,ENGG1300,MMAN1130,MATH1131;MATH1141,MATH1231;MATH1241,PHYS1121;PHYS1131,COMP1511;COMP1911;ENGG1811')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('14', '3', 'Level 2 Core Courses', 'CC', 42, 42, 'DESN2000,ENGG2400,ENGG2500,MATH2019,MATH2089,MMAN2300,MMAN2700')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('15', '3', 'Level 3 Core Courses', 'CC', 36, 36, 'AERO3110,AERO3410,AERO3630,AERO3660,MMAN3000,MMAN3200')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('16', '3', 'Level 4 Core Courses', 'CC', 12, 12, 'AERO4110,AERO4620')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('17', '3', 'Thesis Courses', 'CC', 12, 12, 'MMAN4010,MMAN4020,MMAN4951,MMAN4952,MMAN4953')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('18', '3', 'Recommended Disciplinary Electives', 'DE', 6, 6, 'AERO9500,AERO9610,AERO9660,MECH4305,MECH4320,MECH4620,MECH4900,MECH9420,MMAN4200,MMAN4400,MMAN4410')""")
cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
                   VALUES ('19', '3', 'Discipline Electives', 'DE', 12, 12, 'COMP3141,COMP3331,ELEC4633,ENGG2600,ENGG3001,ENGG3060,ENGG3600,ENGG4600,ENGG4841,MANF4100,MANF4430,MANF4611,MANF6860,MECH4100,MECH4880,MECH9325,MECH9650,MECH9660,MECH9720,MECH9761,MTRN4030,MTRN9400,SOLA5052,SOLA5053,SOLA5056,SOLA5057')""")
# has postgrad courses in it - add later
# cursor.execute(f"""INSERT INTO stream_rules(stream_rule_id, stream_id, name, type, min_uoc, max_uoc, definition)
#                    VALUES ('19', '3', 'Discipline Electives', 'DE', 12, 12, 'COMP3141,COMP3331,ELEC4633,ENGG2600,ENGG3001,ENGG3060,ENGG3600,ENGG4600,ENGG4841,MANF4100,MANF4430,MANF4611,MANF6860,MANF9400,MANF9420,MANF9472,MECH4100,MECH4880,MECH9325,MECH9650,MECH9660,MECH9720,MECH9761,MTRN4030,MTRN9400,SOLA5052,SOLA5053,SOLA5056,SOLA5057')""")

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
                   VALUES ('z5555555', '898', 70, 'CR')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '912', 76, 'DN')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '893', 76, 'DN')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '1453', 76, 'DN')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '1988', 76, 'DN')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '1991', 76, 'DN')""")
cursor.execute(f"""INSERT INTO course_enrolments(zid, course_id, mark, grade)
                   VALUES ('z5555555', '1986', 76, 'FL')""")

cursor.close()
conn.commit()
conn.close()
