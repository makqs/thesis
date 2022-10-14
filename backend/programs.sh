#!/bin/sh

# curl --silent https://www.handbook.unsw.edu.au/api/content/render/false/query/+contentType:unsw_pcourse%20+unsw_pcourse.studyLevelURL:undergraduate%20+unsw_pcourse.implementationYear:2021%20+deleted:false/limit/1000 |
# jq -r '.["contentlets"][] | (.code + "_" + .name)' |
# sort -n > programs.txt

curl --silent https://www.handbook.unsw.edu.au/api/content/render/false/query/+contentType:unsw_pcourse%20+unsw_pcourse.studyLevelURL:undergraduate%20+unsw_pcourse.implementationYear:2021%20+deleted:false/limit/1000 |
jq -r '.contentlets[].data' |
jq -r '(.code + "_" + .title + "_" + .implementation_year + "_" + .credit_points + "_" + .parent_academic_org.value + "_" + .academic_org.value + "_" + .campus)' |
grep -Ei '(sydney|paddington)\s*$' |
sed -r 's/_[^_]*$//' |
sort -n > programs.txt
