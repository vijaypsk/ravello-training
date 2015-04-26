#!/bin/sh

adminUsername=admin
adminPassword=admin

trainingUsername=training-admin
trainingPassword=admin

mongo admin --eval "db.removeUser('$adminUsername'); db.addUser('$adminUsername', '$adminPassword');"
mongo -u $adminUsername -p $adminUsername admin --eval "db2 = db.getSiblingDB('training'); db2.removeUser('$trainingUsername'); db2.addUser('$trainingUsername', '$trainingPassword');"

