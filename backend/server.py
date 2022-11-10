#!/usr/bin/env python3

import json
from flask import Flask, request
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)

# returns { token, zid, name, is_staff }
@app.route("/user/auth/login", methods=["POST"])
def login():
    body = json.loads(request.get_data())
    zid = body["zid"]

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(f"""SELECT * FROM users WHERE zid = '{zid}'""")
            user_details = curs.fetchone()

    if user_details is None:
        return json.dumps({"error": f"zID ({zid}): not found"}), 400

    return (
        json.dumps(
            {
                "token": "Bearer dkfjvn3498ndfsv9802345bfd",
                "zid": user_details[0],
                "name": user_details[1],
                "is_staff": user_details[2],
            }
        ),
        200,
    )


@app.route("/user/auth/logout", methods=["POST"])
def logout():
    # TODO
    pass


# returns { program_id, year, code, title, total_uoc, faculty, school }
@app.route("/user/program", methods=["GET"])
def get_user_program():
    zid = request.args.get("zid")

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(
                f"""SELECT program_id FROM program_enrolments WHERE zid = '{zid}'"""
            )
            program_id = curs.fetchone()

            if program_id is None:
                return (
                    json.dumps({"error": f"zID ({zid}): not enrolled in a program"}),
                    400,
                )

            curs.execute(
                f"""SELECT year, code, title, total_uoc, faculty, school FROM programs WHERE program_id = '{program_id[0]}'"""
            )
            program_data = curs.fetchone()

    return (
        json.dumps(
            {
                "program_id": str(program_id[0]),
                "year": str(program_data[0]),
                "code": str(program_data[1]),
                "title": str(program_data[2]),
                "total_uoc": str(program_data[3]),
                "faculty": str(program_data[4]),
                "school": str(program_data[5]),
            }
        ),
        200,
    )


# returns { program_id, year, code, title, total_uoc, faculty, school }
@app.route("/program", methods=["GET"])
def get_program():
    program_id = request.args.get("program_id")

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(
                f"""SELECT program_id, year, code, title, total_uoc, faculty, school FROM programs WHERE program_id = '{program_id}'"""
            )
            program_data = curs.fetchone()

    if program_id is None:
        return json.dumps({"error": f"program ID ({program_id}): does not exist"}), 400

    return (
        json.dumps(
            {
                "program_id": str(program_data[0]),
                "year": str(program_data[1]),
                "code": str(program_data[2]),
                "title": str(program_data[3]),
                "total_uoc": str(program_data[4]),
                "faculty": str(program_data[5]),
                "school": str(program_data[6]),
            }
        ),
        200,
    )


# returns [ { program_id, year, code, title, total_uoc, faculty, school } ]
@app.route("/programs", methods=["GET"])
def get_programs():
    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(
                f"""SELECT program_id, year, code, title, total_uoc, faculty, school FROM programs ORDER BY code"""
            )
            programs = curs.fetchall()

    if programs is None:
        return json.dumps({"error": f"could not retrieve programs"}), 400

    programs = [
        {
            "program_id": str(row[0]),
            "year": str(row[1]),
            "code": row[2],
            "title": row[3],
            "total_uoc": str(row[4]),
            "faculty": row[5],
            "school": row[6],
        }
        for row in programs
    ]

    return json.dumps(programs), 200


# returns [ { stream_id, year, code, title, total_uoc } ]
@app.route("/user/streams", methods=["GET"])
def get_user_stream():
    zid = request.args.get("zid")

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(
                f"""SELECT stream_id FROM stream_enrolments WHERE zid = '{zid}'"""
            )
            stream_ids = curs.fetchall()

            # if stream_ids == []:
            #     return (
            #         json.dumps({"error": f"zID ({zid}): not enrolled in any streams"}),
            #         400,
            #     )

            streams = []
            for stream_id in stream_ids:
                curs.execute(
                    f"""SELECT year, code, title, total_uoc FROM streams WHERE stream_id = '{stream_id[0]}'"""
                )
                stream = curs.fetchone()
                if stream is None:
                    continue
                stream = {
                    "stream_id": str(stream_id[0]),
                    "year": str(stream[0]),
                    "code": stream[1],
                    "title": stream[2],
                    "total_uoc": str(stream[3]),
                }
                streams.append(stream)

    return (
        json.dumps(streams),
        200,
    )


# returns { stream_id, year, code, title, total_uoc }
@app.route("/stream", methods=["GET"])
def get_stream():
    stream_id = request.args.get("stream_id")

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(
                f"""SELECT stream_id, year, code, title, total_uoc FROM streams WHERE stream_id = '{stream_id}'"""
            )
            stream_data = curs.fetchone()

            if stream_data is None:
                return (
                    json.dumps({"error": f"Stream ID ({stream_id}): not valid stream"}),
                    400,
                )

    return (
        json.dumps(
            [
                {
                    "stream_id": str(stream_data[0]),
                    "year": str(stream_data[1]),
                    "code": str(stream_data[2]),
                    "title": str(stream_data[3]),
                    "total_uoc": str(stream_data[4]),
                }
            ]
        ),
        200,
    )


# returns [ { stream_id, year, code, title, total_uoc } ]
@app.route("/streams", methods=["GET"])
def get_streams():
    program_id = request.args.get("program_id")

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(
                f"""SELECT type, definition FROM program_rules WHERE program_id = '{program_id}'"""
            )
            rule_data = curs.fetchall()

            if rule_data is None:
                return (
                    json.dumps({"error": f"program ID ({program_id}): not found"}),
                    400,
                )

            streams = []
            for rule in rule_data:
                if rule[0] == "ST":
                    for code in rule[1].split(","):
                        curs.execute(
                            f"""SELECT stream_id, year, code, title, total_uoc FROM streams WHERE code = '{code}'"""
                        )
                        stream = curs.fetchone()
                        if stream is None:
                            continue
                        stream = {
                            "stream_id": stream[0],
                            "year": str(stream[1]),
                            "code": stream[2],
                            "title": stream[3],
                            "total_uoc": str(stream[4]),
                        }
                        streams.append(stream)

    return json.dumps(streams), 200


# returns [ { program_rule_id, name, type, uoc, definition } ]
@app.route("/program/rules", methods=["GET"])
def get_program_rules():
    program_id = request.args.get("program_id")

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(
                f"""SELECT program_rule_id, name, type, uoc, num_to_complete, definition FROM program_rules WHERE program_id = '{program_id}'"""
            )
            rule_data = curs.fetchall()

    if rule_data is None:
        return json.dumps({"error": f"program ID ({program_id}): not found"}), 400

    rule_data = [
        {
            "program_rule_id": row[0],
            "name": row[1],
            "type": row[2],
            "uoc": str(row[3]),
            "num_to_complete": str(row[4]),
            "definition": row[5],
        }
        for row in rule_data
    ]

    sort_order = {"CC": 0, "ST": 1, "DE": 2, "GE": 3, "FE": 4}
    rule_data.sort(key=lambda val: sort_order[val["type"]])

    return json.dumps(rule_data), 200


# returns { [code]: [ { stream_rule_id, name, type, uoc, definition } ] }
@app.route("/streams/rules", methods=["GET"])
def get_stream_rules():
    values_list = request.args.getlist("values")

    rules = {}
    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            for values in values_list:
                id, code = values.split(",")
                curs.execute(
                    f"""SELECT stream_rule_id, name, type, uoc, num_to_complete, definition FROM stream_rules WHERE stream_id = '{id}'"""
                )
                rule_data = curs.fetchall()

                if rule_data is None:
                    return (
                        json.dumps(
                            {"error": f"stream ID - CODE ({id} - {code}): not found"}
                        ),
                        400,
                    )

                rule_data = [
                    {
                        "stream_rule_id": str(rule[0]),
                        "stream": code,
                        "name": rule[1],
                        "type": rule[2],
                        "uoc": str(rule[3]),
                        "num_to_complete": str(rule[4]),
                        "definition": rule[5],
                    }
                    for rule in rule_data
                ]
                sort_order = {"ST": 0, "CC": 1, "DE": 2, "GE": 3, "FE": 4}

                rule_data.sort(key=lambda val: sort_order[val["type"]])

                rules[code] = rule_data

    return json.dumps(rules), 200


# returns [ { course_id, code, title, year, uoc, mark, grade, is_ge } ]
@app.route("/user/enrolments", methods=["GET"])
def get_enrolments():
    zid = request.args.get("zid")

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(
                f"""SELECT course_id, mark, grade FROM course_enrolments WHERE zid = '{zid}'"""
            )
            enrolment_data = curs.fetchall()

            if enrolment_data is None:
                return json.dumps({"error": f"zID ({zid}): not found"}), 400

            courses = []

            enrolment_data = [(row[0], str(row[1]), row[2]) for row in enrolment_data]
            for enrolment in enrolment_data:
                curs.execute(
                    f"""SELECT code, title, year, uoc, is_ge, faculty, school FROM courses WHERE course_id = '{enrolment[0]}'"""
                )
                course_data = curs.fetchone()
                courses.append(
                    {
                        "course_id": str(enrolment[0]),
                        "code": course_data[0],
                        "title": course_data[1],
                        "year": str(course_data[2]),
                        "uoc": str(course_data[3]),
                        "mark": str(enrolment[1]),
                        "grade": enrolment[2],
                        "is_ge": str(course_data[4]),
                        "faculty": str(course_data[5]),
                        "school": str(course_data[6]),
                    }
                )

    return json.dumps(courses), 200


# returns [ { course_id, code, title, year, uoc, is_ge } ]
@app.route("/courses", methods=["GET"])
def get_courses():
    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(
                f"""SELECT course_id, code, title, year, uoc, is_ge, faculty, school FROM courses ORDER BY code ASC, year DESC"""
            )
            course_data = curs.fetchall()
            course_data = [
                {
                    "course_id": str(row[0]),
                    "code": row[1],
                    "title": row[2],
                    "year": str(row[3]),
                    "uoc": str(row[4]),
                    "is_ge": str(row[5]),
                    "faculty": str(row[6]),
                    "school": str(row[7]),
                }
                for row in course_data
            ]

    if course_data is None:
        return json.dumps({"error": f"Could not retrieve courses"}), 400

    return json.dumps(course_data), 200


# returns { course_id, code, title, year, uoc, is_ge }
@app.route("/course", methods=["GET"])
def get_course():
    code = request.args.get("code")

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(
                f"""SELECT course_id, code, title, year, uoc, is_ge, faculty, school FROM courses WHERE code = '{code}' ORDER BY year DESC"""
            )
            course_data = curs.fetchone()

    if course_data is None:
        return (
            json.dumps({"error": f"Could not retrieve course with code '{code}'"}),
            400,
        )

    return (
        json.dumps(
            {
                "course_id": str(course_data[0]),
                "code": course_data[1],
                "title": course_data[2],
                "year": str(course_data[3]),
                "uoc": str(course_data[4]),
                "is_ge": str(course_data[5]),
                "faculty": str(course_data[6]),
                "school": str(course_data[7]),
            }
        ),
        200,
    )


# returns [ { zid, name } ]
@app.route("/students", methods=["GET"])
def get_students():
    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(
                f"""SELECT zid, name FROM users WHERE is_staff = 'f' ORDER BY zid ASC, name ASC"""
            )
            students = curs.fetchall()
            students = [{"zid": str(row[0]), "name": str(row[1])} for row in students]

    if students is None:
        return json.dumps({"error": "Could not retrieve students"}), 400

    return json.dumps(students), 200


# returns [ { zid, original_course, substitution_course }]
@app.route("/substitutions", methods=["GET"])
def get_substitutions():
    zid = request.args.get("zid")

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(
                f"""SELECT zid, original_course, substitution_course FROM substitutions WHERE zid = '{zid}' ORDER BY original_course ASC"""
            )
            subs = curs.fetchall()
            subs = [
                {
                    "zid": str(row[0]),
                    "original_course": str(row[1]),
                    "substitution_course": str(row[2]),
                }
                for row in subs
            ]

    return json.dumps(subs), 200


# returns {}
@app.route("/substitution", methods=["POST"])
def post_substitution():
    body = json.loads(request.get_data())
    zid = body["zid"]
    orig = body["orig"]
    sub = body["sub"]

    with psycopg2.connect(host="127.0.0.1", database="pc", user="maxowen") as conn:
        with conn.cursor() as curs:
            curs.execute(
                f"""INSERT INTO substitutions(zid, original_course, substitution_course) VALUES ('{zid}', '{orig}', '{sub}')"""
            )

    return json.dumps({}), 200


if __name__ == "__main__":
    app.run(debug=True)
