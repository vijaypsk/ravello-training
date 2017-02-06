#!/bin/bash
source ~/.profile
cd $RAVELLO_TRAINING_HOME
cd ./training-server
NODE_ENV="production" exec node server.js

