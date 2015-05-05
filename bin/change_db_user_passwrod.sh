#!/bin/sh

username=$1
existingPassword=$2
newPassword=$3

mongo -u $username -p $existingPassword training --eval "db.removeUser('training'); db.addUser('training', '$newPassword');"

