#!/bin/sh

if [ "$#" -ne 3 ]; then
    echo "Usage: change_db_user_passwrod.sh <username> <existing password> <new password>"
    exit 1
fi

username=$1
existingPassword=$2
newPassword=$3

mongo -u $username -p $existingPassword training --eval "db.removeUser('training'); db.addUser('training', '$newPassword');"

