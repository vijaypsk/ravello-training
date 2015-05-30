#!/bin/bash

hostname=$(cat /etc/ravello/vm.json | sed -e 's/,/\n/g' | grep fqdns | awk -F: '{print $2}' | sed -e 's/["}\[]//g' | sed -e 's/\]//g')

cat /etc/log_files.yml | grep -v hostname > /tmp/log_files.yml
echo "hostname: $hostname" >> /tmp/log_files.yml

cp /tmp/log_files.yml /etc/log_files.yml

sudo /etc/init.d/remote_syslog restart

