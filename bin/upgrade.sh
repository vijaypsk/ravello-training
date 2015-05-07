#!/bin/sh

TP_HOME=~/Workspace/ravello_training

cd $TP_HOME

echo "Step 1/7: fetching new code from github.com"
echo ""

git pull

cd $TP_HOME/training-webapp

echo "Updating webapp"
echo ""

echo "Step 2/7: running npm install"
echo ""

npm install

echo "Step 3/7: running bower update"
echo ""

bower update

echo "Step 4/7: running grunt build"
echo ""

grunt build

cd $TP_HOME/training-server

echo "Updating server"
echo ""

echo "Step 5/7: running npm install"
echo ""

npm install

echo "Step 6/7: setting revision.txt"
echo ""

rm -f $TP_HOME/training-webapp/target/revision.txt
rm -f $TP_HOME/training-server/revision.txt

git rev-parse HEAD > $TP_HOME/training-webapp/target/revision.txt
cp $TP_HOME/training-webapp/target/revision.txt $TP_HOME/training-server/revision.txt

echo "Step 7/7: restarting node server"
echo ""

cd $TP_HOME/bin

./restart_rest_server.sh

echo "Upgrade finished successfully"

