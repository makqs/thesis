#!/usr/bin/env python3

import psycopg2, re

# connect to handbook db
hb_conn = psycopg2.connect(
    host="127.0.0.1",
    database="handbook",
    user="maxowen")
hb_cur = hb_conn.cursor()

# connect to progression checker db
pg_conn = psycopg2.connect(
    host="127.0.0.1",
    database="pg_db",
    user="maxowen")
pg_cur = pg_conn.cursor()

# temporarily create view for all objects
hb_cur.execute("""
    CREATE OR REPLACE VIEW public.all_objects AS
        SELECT r.id,
            ri.id AS instid,
            r.record_type AS rtype,
            ri.code,
            ri.name,
            ri.acad_unit_responsible AS ouid,
            ou.longname AS ouname,
            ri.career,
            COALESCE(c.uoc, p.minimum_uoc::numeric, s.uoc::numeric) AS uoc
        FROM records r
            JOIN record_instances ri ON ri.id = r.cur_published_inst
            LEFT JOIN course_records c ON c.id = ri.id
            LEFT JOIN program_records p ON p.id = ri.id
            LEFT JOIN stream_records s ON s.id = ri.id
            JOIN orgunits ou ON ou.id = ri.acad_unit_responsible
""")

# temporarily create view for all rules
hb_cur.execute("""
    CREATE OR REPLACE VIEW public.all_rules AS
        SELECT r.id AS rec_id,
            i.id AS inst_id,
            ru.id AS rule_id,
            ru.obj_group AS rule_obj_group,
            r.record_type AS rec_t,
            i.code,
            substr(i.name::text, 0, 16) AS name,
            ru.rule_type AS rul_t,
            ru.title,
            ru.rule_applicability AS appl,
            ru.min_val AS min,
            ru.max_val AS max,
            g.id AS aog_id,
            g.gtype AS aog_gtype,
            COALESCE(g.definition, 'none'::text) AS defn,
            COALESCE(g.raw_defn, 'none'::text) AS raw_defn
        FROM records r
            JOIN record_instances i ON r.cur_published_inst = i.id
            JOIN acad_rule_sets rs ON rs.record = r.id
            JOIN acad_rule_set_members m ON m.rule_set = rs.id
            JOIN acad_rules ru ON ru.id = m.rule
            LEFT JOIN acad_object_groups g ON g.id = ru.obj_group
        ORDER BY i.code, m.sequence;
""")

# populate the programs table
hb_cur.execute("SELECT id, code, name, uoc FROM all_objects WHERE rtype = 'PR'")
for program_id, code, title, uoc in hb_cur.fetchall():
    title = re.sub(r"'", r"''", title)
    if uoc is None:
        uoc = 'NULL'
    pg_cur.execute(f"""INSERT INTO programs(program_id, year, code, title, total_uoc)
                       VALUES ({program_id}, NULL, '{code}', '{title}', {uoc})
                       ON CONFLICT (program_id) DO NOTHING""")

# populate the streams table
hb_cur.execute("SELECT id, code, name, uoc FROM all_objects WHERE rtype = 'ST'")
for program_id, code, title, uoc in hb_cur.fetchall():
    title = re.sub(r"'", r"''", title)
    if uoc is None:
        uoc = 'NULL'
    pg_cur.execute(f"""INSERT INTO streams(stream_id, year, code, title, total_uoc)
                       VALUES ({program_id}, NULL, '{code}', '{title}', {uoc})
                       ON CONFLICT (stream_id) DO NOTHING""")

# popular the academic_program_groups table (with stream requirements)
hb_cur.execute("SELECT aog_id, title, aog_gtype, raw_defn FROM all_rules WHERE aog_gtype = 'ST'")
for aog_id, name, aog_type, definition in hb_cur.fetchall():
    print(f"""INSERT INTO academic_program_groups(apg_id, name, type, definition) VALUES ({aog_id}, '{name}', '{aog_type}', '{definition}')""")
    pg_cur.execute(f"""INSERT INTO academic_program_groups(apg_id, name, type, definition)
                       VALUES ({aog_id}, '{name}', '{aog_type}', '{definition}')
                       ON CONFLICT (apg_id) DO NOTHING""")

# hb_cur.execute("SELECT aog_id, title, aog_gtype, raw_defn FROM all_rules WHERE aog_gtype = 'ST'")
# for aog_id, name, aog_type, definition in hb_cur.fetchall():
#     print(f"""INSERT INTO academic_program_groups(apg_id, name, type, definition) VALUES ({aog_id}, '{name}', '{aog_type}', '{definition}')""")
#     pg_cur.execute(f"""INSERT INTO academic_program_groups(apg_id, name, type, definition)
#                        VALUES ({aog_id}, '{name}', '{aog_type}', '{definition}')
#                        ON CONFLICT (apg_id) DO NOTHING""")

# popular the academic_streams_groups table (with course requirements)

hb_cur.close()
hb_conn.close()

pg_cur.close()
pg_conn.commit()
pg_conn.close()
