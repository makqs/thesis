#!/usr/bin/env python3

import psycopg2, re

hb_conn = psycopg2.connect(
    host="127.0.0.1",
    database="handbook",
    user="maxowen")
hb_cur = hb_conn.cursor()

pg_conn = psycopg2.connect(
    host="127.0.0.1",
    database="pg_db",
    user="maxowen")
pg_cur = pg_conn.cursor()

hb_cur.execute("SELECT id, code, name, uoc FROM active_objects WHERE rtype = 'PR'")
for program_id, code, title, uoc in hb_cur.fetchall():
    title = re.sub(r"'", r"''", title)
    if uoc is None:
        uoc = 'NULL'
    pg_cur.execute(f"""INSERT INTO programs(program_id, year, code, title, total_uoc)
                       VALUES ({program_id}, NULL, '{code}', '{title}', {uoc})""")

hb_cur.execute("SELECT id, code, name, uoc FROM active_objects WHERE rtype = 'ST'")
for program_id, code, title, uoc in hb_cur.fetchall():
    title = re.sub(r"'", r"''", title)
    if uoc is None:
        uoc = 'NULL'
    pg_cur.execute(f"""INSERT INTO streams(stream_id, year, code, title, total_uoc)
                       VALUES ({program_id}, NULL, '{code}', '{title}', {uoc})""")

hb_cur.close()
hb_conn.close()

pg_cur.close()
pg_conn.commit()
pg_conn.close()
