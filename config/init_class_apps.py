#!/usr/bin/python

import argparse, requests, json
from requests.adapters import HTTPAdapter

DEFAULT_NUM_OF_STUDENTS = 200
DEFAULT_SERVER_URL = "http://localhost"

REST_BASE_PATH = "/rest"

args = {}
base_url = ''
headers = {}
auth = ()
session = {}

def parse_args():
	global args

	arg_parser = argparse.ArgumentParser()

	arg_parser.add_argument("class_id", help="The ID of the class")
	arg_parser.add_argument("trainer_username", help="The username of the trainer to access the Training Portal server")
	arg_parser.add_argument("trainer_password", help="The password of the trainer to access the Training Portal server")

	arg_parser.add_argument("--server_url", help="The URL of the server to access too", default=DEFAULT_SERVER_URL)

	args = arg_parser.parse_args()

def init_rest():
	global base_url
	global headers
	global auth
	global session

	base_url = args.server_url + REST_BASE_PATH
	headers = {"Content-Type": "application/json"}
	auth = (args.trainer_username, args.trainer_password)

	session = requests.Session()
	session.mount(args.server_url, HTTPAdapter(max_retries=20))

	print 'Base URL: %s' % base_url

def get_class():
	response = requests.get(base_url + "/classes/" + args.class_id, auth=auth)

	if (response.status_code >= 400):
		print 'Could not find class with ID [%s]' % args.class_id
		exit()

	the_class = response.json()

	if (not the_class):
		print 'Could not find class with ID [%s]' % args.class_id
		exit()
	
	return (the_class)
	
parse_args()
init_rest()

the_class = get_class()

for student in the_class['students']:
    student['apps'] = []

pretty_class = json.dumps(the_class, sort_keys=True, indent=4, separators=(',', ': '))

response = requests.put(base_url + "/classes/" + args.class_id, data=pretty_class, auth=auth, headers=headers, timeout=300)

if (response and response.status_code == requests.codes.ok):
	print "Class updated successfully"
else:
	print "Class update failed: %s" % response.text





