#!/usr/bin/python

import json
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/user/auth/login", methods=['POST'])
def login():
    print("in login!")
    return json.dumps({
        "token": "Bearer dkfjvn3498ndfsv9802345bfd"
    })

if __name__ == "__main__":
    app.run()
