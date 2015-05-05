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

node_pid="$(ps auxwww | grep 'node server.js' | grep -v grep | awk '{print $2}')"

if [ -n "$node_pid" ]; then
    echo "node server process ID: $node_pid"
    echo "kill $node_pid" 
    kill $node_pid
else
    echo "Could not find node server"
fi

echo "Upgrade finished successfully"

