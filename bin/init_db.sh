#!/bin/bash

if [ "$#" -ne 2 ]; then
    echo "Usage: init_db.sh <username> <password>"
    exit 1
fi

username=$1
password=$2

mongo -u $username -p $password training $RAVELLO_TRAINING_HOME/bin/js/init_db.js

