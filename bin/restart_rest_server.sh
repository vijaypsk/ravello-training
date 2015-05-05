#!/bin/sh

echo "Restarting node server"

node_pid="$(ps auxwww | grep 'node server.js' | grep -v grep | awk '{print $2}')"

if [ -n "$node_pid" ]; then
    echo "node server process ID: $node_pid"
    echo "kill $node_pid" 
    kill $node_pid
else
    echo "Could not find node server"
fi

