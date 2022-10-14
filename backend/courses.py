#!/usr/bin/env python3

import re
import subprocess
import time

file = "courses.txt"

with open(file, "w") as f:
    pass

result = subprocess.run(f"""curl --silent \"https://www.handbook.unsw.edu.au/api/content/render/false/query/+contentType:unsw_psubject%20+unsw_psubject.studyLevelURL:undergraduate%20+unsw_psubject.implementationYear:2021%20+deleted:false/orderBy/urlMap/limit/10000\" | jq -r '.["contentlets"][] | (.code + "_" + .title + "_" + .creditPoints + "_" + .generalEducation)'""", shell=True, capture_output=True, text=True)
start = result.stdout.strip()
time.sleep(1)
result = subprocess.run(f"""curl --silent \"https://www.handbook.unsw.edu.au/api/content/render/false/query/+contentType:unsw_psubject%20+unsw_psubject.studyLevelURL:undergraduate%20+unsw_psubject.implementationYear:2021%20+deleted:false/orderBy/urlMap/limit/10000\" | jq -r '.["contentlets"][]["data"]' | jq -r '. | (.parent_academic_org.value + "_" + .academic_org.value + "_" + .campus)'""", shell=True, capture_output=True, text=True)
end = result.stdout.strip()
with open(file, "a") as f:
    for line in zip(start.splitlines(), end.splitlines()):
        full_line = "_".join(line)
        if full_line.strip().lower().endswith("sydney") or full_line.strip().lower().endswith("paddington"):
            full_line = re.sub(r'_(Sydney|Paddington)\s*$', r'', full_line)
            f.write(full_line + '\n')
