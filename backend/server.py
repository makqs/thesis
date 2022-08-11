#!/usr/bin/env python3

import json
from flask import Flask, request
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

@app.route("/user/auth/login", methods=['POST'])
def login():
    body = json.loads(request.get_data())
    zid = body['zid']

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(f"""SELECT * FROM users WHERE zid = '{zid}'""")
            user_details = curs.fetchone()

    if user_details is None:
        return json.dumps({
            "error": f"zID ({zid}): not found"
        }), 400

    return json.dumps({
        "token": "Bearer dkfjvn3498ndfsv9802345bfd",
        "zid": user_details[0],
        "name": user_details[1],
        "is_staff": user_details[2]
    }), 200

@app.route("/user/auth/logout", methods=['POST'])
def logout():
    # TODO
    pass

@app.route("/user/program", methods=['POST'])
def get_program():
    body = json.loads(request.get_data())
    zid = body['zid']

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(f"""SELECT program_id FROM program_enrolments WHERE zid = '{zid}'""")
            program_id = curs.fetchone()

            if program_id is None:
                return json.dumps({
                    "error": f"zID ({zid}): not enrolled in a program"
                }), 400

            curs.execute(f"""SELECT year, code, title, total_uoc FROM programs WHERE program_id = '{program_id[0]}'""")
            program_data = curs.fetchone()

    return json.dumps({
        "program_id": str(program_id[0]),
        "year": str(program_data[0]),
        "code": str(program_data[1]),
        "title": str(program_data[2]),
        "total_uoc": str(program_data[3]),
    }), 200

@app.route("/user/stream", methods=['POST'])
def get_stream():
    body = json.loads(request.get_data())
    zid = body['zid']

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(f"""SELECT stream_id FROM stream_enrolments WHERE zid = '{zid}'""")
            stream_id = curs.fetchone()

            if stream_id is None:
                return json.dumps({
                    "error": f"zID ({zid}): not enrolled in a stream"
                }), 200

            curs.execute(f"""SELECT year, code, title, total_uoc FROM streams WHERE stream_id = '{stream_id[0]}'""")
            stream_data = curs.fetchone()

    return json.dumps({
        "stream_id": str(stream_id[0]),
        "year": str(stream_data[0]),
        "code": str(stream_data[1]),
        "title": str(stream_data[2]),
        "total_uoc": str(stream_data[3]),
    }), 200

@app.route("/user/program/rules", methods=['POST'])
def get_program_rules():
    body = json.loads(request.get_data())
    program_id = body['program_id']

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(f"""SELECT program_rule_id, name, type, min_uoc, definition FROM program_rules WHERE program_id = '{program_id}'""")
            rule_data = curs.fetchall()

    if rule_data is None:
        return json.dumps({
            "error": f"program ID ({program_id}): not found"
        }), 400

    rule_data = [(row[0], row[1], row[2], str(row[3]), row[4]) for row in rule_data]

    return json.dumps({
        "program_rules": rule_data
    }), 200

@app.route("/user/stream/rules", methods=['POST'])
def get_stream_rules():
    body = json.loads(request.get_data())
    stream_id = body['stream_id']

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(f"""SELECT stream_rule_id, name, type, min_uoc, definition FROM stream_rules WHERE stream_id = '{stream_id}'""")
            rule_data = curs.fetchall()

    if rule_data is None:
        return json.dumps({
            "error": f"stream ID ({stream_id}): not found"
        }), 400

    rule_data = [(row[0], row[1], row[2], str(row[3]), row[4]) for row in rule_data]

    return json.dumps({
        "stream_rules": rule_data
    }), 200

# returns [ [ course_id, code, title, year, uoc, mark, grade, is_ge ] ]
@app.route("/user/enrolments", methods=['POST'])
def get_enrolments():
    body = json.loads(request.get_data())
    zid = body['zid']

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(f"""SELECT course_id, mark, grade FROM course_enrolments WHERE zid = '{zid}'""")
            enrolment_data = curs.fetchall()

            if enrolment_data is None:
                return json.dumps({
                    "error": f"zID ({zid}): not found"
                }), 400

            courses = []

            for enrolment in enrolment_data:
                curs.execute(f"""SELECT code, title, year, uoc, is_ge FROM courses WHERE course_id = '{enrolment[0]}'""")
                course_data = curs.fetchone()
                enrolment_data = [(row[0], str(row[1]), row[2]) for row in enrolment_data]
                courses.append((enrolment[0], course_data[0], course_data[1], str(course_data[2]), str(course_data[3]), str(enrolment[1]), enrolment[2], str(course_data[4])))

    return json.dumps({
        "enrolments": courses
    }), 200

@app.route("/courses", methods=['GET'])
def get_courses():
    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(f"""SELECT course_id, code, title, year, uoc, is_ge FROM courses ORDER BY year DESC""")
            course_data = curs.fetchall()
            course_data = [(row[0], row[1], row[2], str(row[3]), str(row[4]), str(row[5])) for row in course_data]

    if course_data is None:
        return json.dumps({
            "error": f"no courses found"
        }), 400

    return json.dumps({
        "courses": course_data
    }), 200

# returns [ course_id, code, title, year, uoc, is_ge ]
@app.route("/course", methods=['POST'])
def get_course():
    body = json.loads(request.get_data())
    code = body['code']

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(f"""SELECT course_id, code, title, year, uoc, is_ge FROM courses WHERE code = '{code}' ORDER BY year DESC""")
            course_data = curs.fetchone()

    if course_data is None:
        return json.dumps({
            "error": f"course not found"
        }), 400

    return json.dumps({
        "course_info": (str(course_data[0]), course_data[1], course_data[2], str(course_data[3]), str(course_data[4]), str(course_data[5]))
    }), 200

if __name__ == "__main__":
    app.run(debug=True)
