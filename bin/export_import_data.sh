#!/bin/bash

if [ "$#" -ne 3 ] && [ "$#" -ne 4 ]; then
    echo "Usage: export_import_data.sh <dest hostname/IP> <username> <password> [use_credentials_in_source]"
    echo "use_credentials_in_source: dismiss if the host DB does not have credentials. Set to true if it does."
    exit 1
fi

dest=$1
username=$2
password=$3
use_creds_in_source=$4

rm -f /tmp/users.json
rm -f /tmp/courses.json
rm -f /tmp/classes.json

creds=""
if [ "$use_creds_in_source" ]; then
    echo "Using credentials in source host"
    creds="--username $username --password $password"
else
    echo "Not using credentials in source host"
fi

mongoexport --db training $creds --collection users --out /tmp/users.json
mongoexport --db training $creds --collection trainingcourses --out /tmp/courses.json
mongoexport --db training $creds --collection trainingclasses --out /tmp/classes.json

mongoimport --host $dest --db training --username $username --password $password --collection users --file /tmp/users.json
mongoimport --host $dest --db training --username $username --password $password --collection trainingcourses --file /tmp/courses.json
mongoimport --host $dest --db training --username $username --password $password --collection trainingclasses --file /tmp/classes.json

