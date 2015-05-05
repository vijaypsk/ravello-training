#!/bin/sh

TP_HOME=~/Workspace/ravello_training

cd $TP_HOME

echo "Step 1/6: fetching new code from github.com"
echo ""

git pull

cd $TP_HOME/training-webapp

echo "Updating webapp"
echo ""

echo "Step 2/6: running npm install"
echo ""

npm install

echo "Step 3/6: running bower update"
echo ""

bower update

echo "Step 4/6: running grunt build"
echo ""

grunt build

cd $TP_HOME/training-server

echo "Updating server"
echo ""

echo "Step 5/6: running npm install"
echo ""

npm install

echo "Step 6/6: restarting node server"
echo ""

cd $TP_HOME/bin

./restart_rest_server.sh

echo "Upgrade finished successfully"

