#!/bin/sh

echo "Step 0/7: prepare script - set up home directory and bin folder"
echo ""

export RAVELLO_TRAINING_HOME="/home/ubuntu/Workspace/ravello_training"
mkdir $RAVELLO_TRAINING_HOME/bin
cp *.* $RAVELLO_TRAINING_HOME/bin

echo "Step 1/7: fetching new code from github.com"
echo ""

git pull

cd $RAVELLO_TRAINING_HOME/training-webapp

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

cd $RAVELLO_TRAINING_HOME/training-server

echo "Updating server"
echo ""

echo "Step 5/7: running npm install"
echo ""

npm install

echo "Step 6/7: setting revision.txt"
echo ""

rm -f $RAVELLO_TRAINING_HOME/training-webapp/target/revision.txt
rm -f $RAVELLO_TRAINING_HOME/training-server/revision.txt

git rev-parse HEAD > $RAVELLO_TRAINING_HOME/training-webapp/target/revision.txt
cp $RAVELLO_TRAINING_HOME/training-webapp/target/revision.txt $RAVELLO_TRAINING_HOME/training-server/revision.txt

echo "Step 7/7: restarting node server"
echo ""

cd $RAVELLO_TRAINING_HOME/bin

./restart_rest_server.sh

echo "Upgrade finished successfully"

