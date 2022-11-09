#!/usr/bin/env python3

import psycopg2, re

# connect to progression checker db
conn = psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen")
cursor = conn.cursor()

cursor.execute(open("db_schema3.sql", "r").read())

# users
cursor.execute(
    f"""INSERT INTO users(zid, name, is_staff) VALUES ('z5555555', 'Sam Student', false)"""
)
cursor.execute(
    f"""INSERT INTO users(zid, name, is_staff) VALUES ('z5263663', 'Max Owen', false)"""
)
cursor.execute(
    f"""INSERT INTO users(zid, name, is_staff) VALUES ('z5166214', 'Benjamin Brown', false)"""
)
cursor.execute(
    f"""INSERT INTO users(zid, name, is_staff) VALUES ('z6666666', 'Liam Lecturer', true)"""
)

# courses
with open("../backend/courses.txt", "r") as f:
    for line in f.readlines():
        line = re.sub(r"'", r"''", line)
        (code, title, uoc, gened, faculty, school) = line.strip().split("_", 5)
        print(code, title, uoc, gened, faculty, school)
        if uoc == "":
            uoc = "0"
        cursor.execute(
            f"""INSERT INTO courses(code, title, year, uoc, is_ge, faculty, school) VALUES ('{code}', '{title}', 2021, {int(uoc)}, {gened}, '{faculty}', '{school}')"""
        )

# gen eds is by the faculty
# need to store school and faculty from the API in the courses
# also need to store school of program
# if not gen ed or same faculty -> cant be taken as gen ed
# if not gen ed or different faculty but part of exception schools (math + infs) -> cant be taken as gen ed
# https://www.handbook.unsw.edu.au/api/content/render/false/query/+contentType:unsw_psubject%20+unsw_psubject.studyLevelURL:undergraduate%20+unsw_psubject.implementationYear:2021%20+unsw_psubject.code:COMP1521%20+deleted:false%20+working:true%20+live:true%20+languageId:1%20/orderBy/modDate%20desc
# https://www.handbook.unsw.edu.au/api/content/render/false/query/+contentType:unsw_pcourse%20+unsw_pcourse.studyLevelURL:undergraduate%20+unsw_pcourse.implementationYear:2021%20+deleted:false/limit/1

# programs
with open("../backend/programs.txt", "r") as f:
    for line in f.readlines():
        line = re.sub(r"'", r"''", line)
        (code, title, year, total_uoc, faculty, school) = line.strip().split("_", 5)
        print(code, title, year, total_uoc, faculty, school)
        cursor.execute(
            f"""INSERT INTO programs(year, code, title, total_uoc, faculty, school) VALUES ({int(year)}, '{code}', '{title}', {int(total_uoc)}, '{faculty}', '{school}')"""
        )

# engineering program rules
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('1', '95', 'Stream', 'ST', 168, 168, 'AEROAH,BINFAH,CEICAH,CEICDH,COMPBH,CVENAH,CVENBH,ELECAH,ELECCH,GMATDH,MANFBH,MECHAH,MINEAH,MTRNAH,PETRAH,SENGAH,SOLAAH,SOLABH,TELEAH')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('2', '95', 'Industrial Experience Requirement', 'CC', 0, 0, 'ENGG4999')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('3', '95', 'General Education', 'GE', 12, 12, NULL)"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('4', '95', 'Discipline Electives', 'DE', 12, 12, 'ENGG2600,ENGG3600,ENGG4600,COMP3XXX,COMP4XXX,COMP6XXX,COMP9XXX,INFS3XXX,INFS4XXX,MATH3XXX,MATH4XXX,MATH6XXX,ELEC3XXX,ELEC4XXX,TELE3XXX,TELE4XXX')"""
)
# cursor.execute(f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('4', '95', 'Discipline Electives', 'DE', 12, 12, 'REFER:ST,DE')""")

# engineering streams
cursor.execute(
    f"""INSERT INTO streams(stream_id, year, code, title, total_uoc) VALUES ('1', 2021, 'SENGAH', 'Software Engineering', 168)"""
)
cursor.execute(
    f"""INSERT INTO streams(stream_id, year, code, title, total_uoc) VALUES ('2', 2021, 'ELECAH', 'Electrical Engineering', 168)"""
)
cursor.execute(
    f"""INSERT INTO streams(stream_id, year, code, title, total_uoc) VALUES ('3', 2021, 'AEROAH', 'Aerospace Engineering', 168)"""
)
cursor.execute(
    f"""INSERT INTO streams(stream_id, year, code, title, total_uoc) VALUES ('4', 2021, 'BINFAH', 'Bioinformatics Engineering', 168)"""
)
cursor.execute(
    f"""INSERT INTO streams(stream_id, year, code, title, total_uoc) VALUES ('5', 2021, 'MECHAH', 'Mechanical Engineering', 168)"""
)

# SENGAH stream rules
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('1', 'Level 1 Core Courses', 'CC', 42, 42, 'COMP1511,COMP1521,COMP1531,ENGG1000,MATH1081,MATH1131;MATH1141,MATH1231;MATH1241')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('1', 'Level 2 Core Courses', 'CC', 42, 42, 'COMP2041,COMP2511,COMP2521,DESN2000,MATH2400,MATH2859,SENG2011,SENG2021')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('1', 'Level 3 Core Courses', 'CC', 24, 24, 'COMP3141,COMP3311,COMP3331,SENG3011')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('1', 'Level 4 Core Courses', 'CC', 18, 18, 'SENG4920,COMP4951,COMP4952,COMP4953')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('1', 'Discipline Electives', 'DE', 36, 36, 'ENGG2600,ENGG3600,ENGG4600,COMP3XXX,COMP4XXX,COMP6XXX,COMP9XXX,INFS3XXX,INFS4XXX,MATH3XXX,MATH4XXX,MATH6XXX,ELEC3XXX,ELEC4XXX,TELE3XXX,TELE4XXX')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('1', 'Free Electives', 'FE', 6, NULL, NULL)"""
)

# ELECAH stream rules
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('2', 'Level 1 Core Courses', 'CC', 48, 48, 'COMP1521,ELEC1111,ENGG1000,PHYS1231,MATH1131;MATH1141,MATH1231;MATH1241,PHYS1121;PHYS1131,COMP1511;COMP1911')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('2', 'Level 2 Core Courses', 'CC', 36, 36, 'DESN2000,ELEC2133,ELEC2134,ELEC2141,MATH2069,MATH2099')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('2', 'Level 3 Core Courses', 'CC', 42, 42, 'ELEC3104,ELEC3105,ELEC3106,ELEC3114,ELEC3115,ELEC3117,TELE3113')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('2', 'Level 4 Core Courses', 'CC', 24, 24, 'ELEC4122,ELEC4123,ELEC4951,ELEC4952,ELEC4953')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('2', 'Breadth Electives', 'DE', 6, 6, 'COMP2041,COMP3211,COMP3231,ELEC2146,ELEC3111,ELEC3145,ELEC3705,ENGG2600,ENGG3001,ENGG3060,ENGG3600,ENGG4060,ENGG4102,ENGG4600,MATH3101,MATH3121,MATH3161,MATH3201,MATH3261,MATH3411,TELE3118,TELE3119')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('2', 'Discipline Electives', 'DE', 12, 12, 'ELEC4445,ELEC4601,ELEC4602,ELEC4603,ELEC4604,ELEC4605,ELEC4611,ELEC4612,ELEC4613,ELEC4614,ELEC4617,ELEC4621,ELEC4622,ELEC4623,ELEC4631,ELEC4632,ELEC4633,PHTN4661,PHTN4662,TELE4642,TELE4651,TELE4652,TELE4653')"""
)

# AEROH stream rules
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('3', 'Level 1 Core Courses', 'CC', 48, 48, 'ELEC1111,ENGG1000,ENGG1300,MMAN1130,MATH1131;MATH1141,MATH1231;MATH1241,PHYS1121;PHYS1131,COMP1511;COMP1911;ENGG1811')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('3', 'Level 2 Core Courses', 'CC', 42, 42, 'DESN2000,ENGG2400,ENGG2500,MATH2019,MATH2089,MMAN2300,MMAN2700')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('3', 'Level 3 Core Courses', 'CC', 36, 36, 'AERO3110,AERO3410,AERO3630,AERO3660,MMAN3000,MMAN3200')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('3', 'Level 4 Core Courses', 'CC', 12, 12, 'AERO4110,AERO4620')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('3', 'Thesis Courses', 'CC', 12, 12, 'MMAN4010,MMAN4020,MMAN4951,MMAN4952,MMAN4953')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('3', 'Recommended Disciplinary Electives', 'DE', 6, 6, 'AERO9500,AERO9610,AERO9660,MECH4305,MECH4320,MECH4620,MECH4900,MECH9420,MMAN4200,MMAN4400,MMAN4410')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('3', 'Discipline Electives', 'DE', 12, 12, 'COMP3141,COMP3331,ELEC4633,ENGG2600,ENGG3001,ENGG3060,ENGG3600,ENGG4600,ENGG4841,MANF4100,MANF4430,MANF4611,MANF6860,MECH4100,MECH4880,MECH9325,MECH9650,MECH9660,MECH9720,MECH9761,MTRN4030,MTRN9400,SOLA5052,SOLA5053,SOLA5056,SOLA5057')"""
)
# has postgrad courses in it - add later
# cursor.execute(f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ( '3', 'Discipline Electives', 'DE', 12, 12, 'COMP3141,COMP3331,ELEC4633,ENGG2600,ENGG3001,ENGG3060,ENGG3600,ENGG4600,ENGG4841,MANF4100,MANF4430,MANF4611,MANF6860,MANF9400,MANF9420,MANF9472,MECH4100,MECH4880,MECH9325,MECH9650,MECH9660,MECH9720,MECH9761,MTRN4030,MTRN9400,SOLA5052,SOLA5053,SOLA5056,SOLA5057')""")

# BINFAH stream
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('4', 'Level 1 Core Courses', 'CC', 60, 60, 'BABS1201,COMP1511,COMP1521,COMP1531,ENGG1000,MATH1081,CHEM1011;CHEM1031,PHYS1111;PHYS1121;PHYS1131,MATH1131;MATH1141,MATH1231;MATH1241')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('4', 'Level 2 Core Courses', 'CC', 48, 48, 'BINF2010,BIOC2201,COMP2041,COMP2511,COMP2521,DESN2000,MATH2801;MATH2901,BABS2202;BABS2204;BABS2264;BIOC2101;MICR2011')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('4', 'Level 3 Core Courses', 'CC', 30, 30, 'BABS3121,BINF3010,BINF3020,COMP3121,COMP3311')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('4', 'Level 4 Core Courses', 'CC', 18, 18, 'COMP4920,COMP4951,COMP4952,COMP4953')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('4', 'Discipline Electives', 'DE', 12, 12, 'ENGG2600,ENGG3060,ENGG3600,ENGG4600,COMP3XXX,COMP4XXX,COMP6XXX,COMP9XXX,BABS3XXX,MICR3XXX,BIOC3XXX')"""
)

# MECHAH stream
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('5', 'Level 1 Core Courses', 'CC', 48, 48, 'ELEC1111,ENGG1000,ENGG1300,MMAN1130,MATH1131;MATH1141,MATH1231;MATH1241,PHYS1121;PHYS1131,COMP1511;COMP1911;ENGG1811')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('5', 'Level 2 Core Courses', 'CC', 42, 42, 'DESN2000,ENGG2400,ENGG2500,MATH2089,MMAN2300,MMAN2700,MATH2018;MATH2019')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('5', 'Level 3 Core Courses', 'CC', 30, 30, 'MECH3110,MECH3610,MMAN3000,MMAN3200,MMAN3400')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('5', 'Level 4 Core Courses', 'CC', 6, 6, 'MECH4100')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('5', 'Thesis Courses', 'CC', 12, 12, 'MMAN4010,MMAN4020,MMAN4951,MMAN4952,MMAN4953')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('5', 'Recommended Discipline Electives', 'DE', 18, 18, 'MECH4305,MECH4320,MECH4620,MECH4880,MECH4900,MECH9325,MECH9420,MECH9650,MECH9660,MECH9720,MECH9761,MMAN4400,MMAN4410')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('5', 'Discipline Electives', 'DE', 12, 12, 'AERO9500,AERO9610,AERO9660,COMP3141,COMP3331,ELEC4633,ENGG2600,ENGG3001,ENGG3060,ENGG3600,ENGG4600,ENGG4841,MANF4100,MANF4430,MANF4611,MANF6860,MECH4100,MTRN4030,MTRN9400,SOLA5052,SOLA5053,SOLA5056,SOLA5057')"""
)
# add after adding postgrad courses
# cursor.execute(
#     f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('5', 'Discipline Electives', 'DE', 12, 12, 'AERO9500,AERO9610,AERO9660,COMP3141,COMP3331,ELEC4633,ENGG2600,ENGG3001,ENGG3060,ENGG3600,ENGG4600,ENGG4841,MANF4100,MANF4430,MANF4611,MANF6860,MANF9400,MANF9420,MANF9472,MECH4100,MTRN4030,MTRN9400,SOLA5052,SOLA5053,SOLA5056,SOLA5057')"""
# )

# commerce program rules
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('5', '61', 'Integrated First Year Courses', 'CC', 48, 48, 'COMM1100,COMM1110,COMM1120,COMM1140,COMM1150,COMM1170,COMM1180,COMM1190')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('6', '61', 'myBCom', 'CC', 0, 0, 'COMM0999,COMM1999,COMM3999')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('7', '61', 'Commerce Streams', 'ST', 48, 48, 'ACCTA1,COMMJ1,ECONF1,FINSA1,FINSR1,IBUSA1,INFSA1,MARKA1,MGMTH1,TABLC1')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('8', '61', 'Prescribed Work Intergrated Learning Course', 'CC', 6, 6, 'CDEV3000,COMM2222,COMM2233,COMM2244,COMM3020,COMM3030')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('9', '61', 'Final Year Synthesis', 'CC', 6, 6, 'ACCT3583,COMM2233,COMM3020,COMM3030,COMM3090,COMM3500,COMM3900,TABL3033')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('10', '61', 'Free Electives', 'FE', 0, 36, NULL)"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('11', '61', 'General Education', 'GE', 12, 12, NULL)"""
)

# comp sci program rules
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('12', '108', 'Streams', 'ST', 96, 96, 'COMPA1,COMPD1,COMPE1,COMPI1,COMPJ1,COMPN1,COMPS1,COMPY1')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('13', '108', 'Free Electives', 'FE', 36, 36, NULL)"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('14', '108', 'General Education', 'GE', 12, 12, NULL)"""
)

# comp sci streams
cursor.execute(
    f"""INSERT INTO streams(stream_id, year, code, title, total_uoc) VALUES ('6', 2021, 'COMPA1', 'Computer Science', 96)"""
)
cursor.execute(
    f"""INSERT INTO streams(stream_id, year, code, title, total_uoc) VALUES ('7', 2021, 'COMPD1', 'Database Systems', 96)"""
)
cursor.execute(
    f"""INSERT INTO streams(stream_id, year, code, title, total_uoc) VALUES ('8', 2021, 'COMPE1', 'eCommerce Systems', 96)"""
)
cursor.execute(
    f"""INSERT INTO streams(stream_id, year, code, title, total_uoc) VALUES ('9', 2021, 'COMPI1', 'Artificial Intelligence', 96)"""
)
cursor.execute(
    f"""INSERT INTO streams(stream_id, year, code, title, total_uoc) VALUES ('10', 2021, 'COMPJ1', 'Programming Languages', 96)"""
)
cursor.execute(
    f"""INSERT INTO streams(stream_id, year, code, title, total_uoc) VALUES ('11', 2021, 'COMPN1', 'Computer Networks', 96)"""
)
cursor.execute(
    f"""INSERT INTO streams(stream_id, year, code, title, total_uoc) VALUES ('12', 2021, 'COMPS1', 'Embedded Systems', 96)"""
)
cursor.execute(
    f"""INSERT INTO streams(stream_id, year, code, title, total_uoc) VALUES ('13', 2021, 'COMPY1', 'Security Engineering', 96)"""
)

# comp sci (stream) rules
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('6', 'Core Courses', 'CC', 66, 66, 'COMP1511,COMP1521,COMP1531,COMP2511,COMP2521,COMP3900,COMP4920,MATH1081,MATH1131;MATH1141,MATH1231;MATH1241,COMP3121;COMP3821')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('6', 'Computing Electives', 'DE', 30, 30, 'ENGG2600,ENGG3600,ENGG4600,COMP3XXX,COMP4XXX,COMP6XXX,COMP9XXX')"""
)

# database systems rules
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('7', 'Core Courses', 'CC', 72, 72, 'COMP1511,COMP1521,COMP1531,COMP2511,COMP2521,COMP3311,COMP3900,COMP4920,MATH1081,MATH1131;MATH1141,MATH1231;MATH1241,COMP3121;COMP3821')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('7', 'Computing Elective', 'DE', 6, 6, 'ENGG2600,ENGG3600,ENGG4600,COMP3XXX,COMP4XXX,COMP6XXX,COMP9XXX')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('7', 'Database Systems Prescribed Electives', 'DE', 18, 18, 'COMP6714,COMP9313,COMP9315,COMP9318,COMP9319')"""
)

# ecommerce systems rules
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('8', 'Core Courses', 'CC', 72, 72, 'COMP1511,COMP1521,COMP1531,COMP2511,COMP2521,COMP3311,COMP3900,COMP4920,MATH1081,MATH1131;MATH1141,MATH1231;MATH1241,COMP3121;COMP3821')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('8', 'Computing Elective', 'DE', 6, 6, 'ENGG2600,ENGG3600,ENGG4600,COMP3XXX,COMP4XXX,COMP6XXX,COMP9XXX')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('8', 'Discipline Electives', 'DE', 18, 18, 'COMP3511,COMP9321,COMP9322,COMP9323')"""
)

# artificial intelligence rules
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('9', 'Core Courses', 'CC', 72, 72, 'COMP1511,COMP1521,COMP1531,COMP2511,COMP2521,COMP3411,COMP3900,COMP4920,MATH1081,MATH1131;MATH1141,MATH1231;MATH1241,COMP3121;COMP3821')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('9', 'Artificial Intelligence Prescribed Electives', 'DE', 18, 18, 'COMP3431,COMP4418,COMP9318,COMP9417,COMP9418,COMP9444,COMP9517')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('9', 'Computing Elective', 'DE', 6, 6, 'ENGG2600,ENGG3600,ENGG4600,COMP3XXX,COMP4XXX,COMP6XXX,COMP9XXX')"""
)

# programming languages rules
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('10', 'Core Courses', 'CC', 72, 72, 'COMP1511,COMP1521,COMP1531,COMP2511,COMP2521,COMP3121,COMP3161,COMP3900,COMP4920,MATH1081,MATH1131;MATH1141,MATH1231;MATH1241')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('10', 'Computing Elective', 'DE', 6, 6, 'ENGG2600,ENGG3600,ENGG4600,COMP3XXX,COMP4XXX,COMP6XXX,COMP9XXX')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('10', 'Discipline Electives', 'DE', 18, 18, 'COMP3131,COMP3141,COMP3151,COMP6771')"""
)

# computer networks rules
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('11', 'Core Courses', 'CC', 72, 72, 'COMP1511,COMP1521,COMP1531,COMP2511,COMP2521,COMP3331,COMP3900,COMP4920,MATH1081,MATH1131;MATH1141,MATH1231;MATH1241,COMP3121;COMP3821')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('11', 'Computing Elective', 'DE', 6, 6, 'ENGG2600,ENGG3600,ENGG4600,COMP3XXX,COMP4XXX,COMP6XXX,COMP9XXX')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('11', 'Discipline Electives', 'DE', 18, 18, 'COMP4336,COMP4337,COMP6733,COMP9332,COMP9334')"""
)

# computer networks rules
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('12', 'Core Courses', 'CC', 78, 78, 'COMP1511,COMP1521,COMP1531,COMP2121,COMP2511,COMP2521,COMP3222,COMP3900,COMP4920,MATH1081,MATH1131;MATH1141,MATH1231;MATH1241,COMP3121;COMP3821')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('12', 'Prescribed Electives', 'DE', 18, 18, 'COMP3211,COMP3231,COMP3601,COMP4601,COMP9242,COMP9517')"""
)

# computer networks rules
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('13', 'Core Courses', 'CC', 72, 72, 'COMP1511,COMP1521,COMP1531,COMP2511,COMP2521,COMP3121,COMP3331,COMP3900,COMP4920,MATH1081,MATH1131;MATH1141,MATH1231;MATH1241,COMP6441;COMP6841')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('13', 'Computing Elective', 'DE', 6, 6, 'ENGG2600,ENGG3600,ENGG4600,COMP3XXX,COMP4XXX,COMP6XXX,COMP9XXX')"""
)
cursor.execute(
    f"""INSERT INTO stream_rules(stream_id, name, type, min_uoc, max_uoc, definition) VALUES ('13', 'Security Engineering Prescribed Electives', 'DE', 18, 18, 'COMP4337,COMP6443,COMP6445,COMP6447,COMP6448,COMP6449,COMP6843,COMP6845,COMP9447,MATH3411,TELE3119')"""
)

# medicine program rules
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('15', '117', 'Stage 1 Core Courses', 'CC', 96, 96, 'MFAC1501,MFAC1521,MFAC1522,MFAC1523,MFAC1524,MFAC1525,MFAC1526,MFAC1527')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('16', '117', 'Stage 2 Core Courses', 'CC', 84, 84, 'MFAC2507,MFAC2511,MFAC2512,MFAC2514,MFAC2515,MFAC2516,MFAC4888')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('17', '117', 'Stage 3 Core Courses', 'CC', 96, 96, 'MFAC3501,MFAC3502,MFAC3503,MFAC3504,MFAC3505,MFAC3506,MFAC3508,MFAC3509,MFAC3512,MFAC3514,MFAC3515,MFAC3522,MFAC3523')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('18', '117', 'General Education', 'GE', 12, 12, NULL)"""
)

# aviation program rules
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('19', '139', 'Level 1 Core Courses', 'CC', 48, 48, 'AVEN1920,AVIA1111,AVIA1901,MATH1031,MATH1041,PHYS1149,PHYS1121')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('20', '139', 'Level 2 Core Courses', 'CC', 42, 42, 'AVIA2111,AVIA2112,AVIA2113,AVIA2114,AVIA2115,AVIA2116,AVIA2117')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('21', '139', 'Level 3 Core Courses', 'CC', 42, 42, 'AVIA3101,AVIA3111,AVIA3112,AVIA3113,AVIA3114,AVIA3301,AVIA3401')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('22', '139', 'General Education', 'GE', 12, 12, NULL)"""
)

# engineering / computer science program rules
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('23', '113', 'Engineering (Honours) - Stream', 'ST', 168, 168, 'AEROAH,CEICAH,CEICDH,CVENAH,CVENBH,ELECAH,ELECCH,GMATDH,MANFBH,MECHAH,MINEAH,MTRNAH,PETRAH,SOLAAH,SOLABH,TELEAH')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('24', '113', 'Engineering (Honours) - Industrial Experience Requirement', 'CC', 0, 0, 'ENGG4999')"""
)
cursor.execute(
    f"""INSERT INTO program_rules(program_rule_id, program_id, name, type, min_uoc, max_uoc, definition) VALUES ('25', '113', 'Computer Science - Stream', 'ST', 96, 96, 'COMPA1,COMPD1,COMPE1,COMPI1,COMPJ1,COMPN1,COMPS1,COMPY1')"""
)

# user program and stream enrolments
# engineering 95, commerce 61, comp sci 108, medicine 117, flying 139, eng / cs 113
cursor.execute(
    f"""INSERT INTO program_enrolments(zid, program_id) VALUES ('z5555555', '95')"""
)
cursor.execute(
    f"""INSERT INTO stream_enrolments(zid, stream_id) VALUES ('z5555555', '2')"""
)
# cursor.execute(
#     f"""INSERT INTO stream_enrolments(zid, stream_id) VALUES ('z5555555', '9')"""
# )

# user course enrolments
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '891', 84, 'DN')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '892', 77, 'DN')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '893', 85, 'FL')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '2005', 78, 'DN')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '235', 80, 'DN')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '2029', 84, 'DN')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '952', 96, 'HD')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '2424', 60, 'PS')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '898', 70, 'CR')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '912', 76, 'DN')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '893', 76, 'DN')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '1453', 76, 'DN')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '1988', 76, 'DN')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '1991', 76, 'DN')"""
)
cursor.execute(
    f"""INSERT INTO course_enrolments(zid, course_id, mark, grade) VALUES ('z5555555', '1986', 76, 'FL')"""
)

cursor.close()
conn.commit()
conn.close()
