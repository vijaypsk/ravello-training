#!/usr/bin/python

import argparse, requests, json, csv
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
	arg_parser.add_argument("students_csv_file_path", help="The full path to the CSV file of the students")
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

def get_class_and_course():
	response = requests.get(base_url + "/classes/" + args.class_id, auth=auth)

	if (response.status_code >= 400):
		print 'Could not find class with ID [%s]' % args.class_id
		exit()

	the_class = response.json()
	
	if (not the_class or not the_class['courseId']):
		print 'Could not find class with ID [%s]' % args.class_id
		exit()
	
	response = requests.get(base_url + "/courses/" + the_class['courseId'], auth=auth)
	the_course = response.json()
	
	if (not the_course):
		print 'Could not find the matching course of the class'
		exit()
		
	return (the_class, the_course)
	
def transform_bp(bp, base_bp_permissions):
	return {
		 'bpId': int(bp['id']),
		 'startVms': base_bp_permissions['startVms'].lower() == 'true',
		 'stopVms': base_bp_permissions['stopVms'].lower() == 'true',
		 'restartVms': base_bp_permissions['restartVms'].lower() == 'true',
		 'console': base_bp_permissions['console'].lower() == 'true'
	}

def create_student_from_row(student_row, the_class, the_course):
    first_name = student_row[0]
    surname = student_row[1]
    username = student_row[2]
    password = student_row[3]

    base_bp_permissions = {
        'startVms': student_row[4],
        'stopVms': student_row[5],
        'restartVms': student_row[6],
        'console': student_row[7],
    }

    return {
		'user': {
			'firstName': first_name,
			'surname': surname,
			'username': username,
			'password': password,
		},
		'blueprintPermissions': [transform_bp(bp, base_bp_permissions) for bp in the_course['blueprints']]
	}
    
def set_students_from_csv(the_class, the_course):
    the_class['students'] = []
    with open(args.students_csv_file_path, 'rb') as csv_file:
        file_content = csv.reader(csv_file)
        for student_row in file_content:
            student = create_student_from_row(student_row, the_class, the_course)
            the_class['students'].append(student)

parse_args()
init_rest()

the_class, the_course = get_class_and_course()
set_students_from_csv(the_class, the_course)

pretty_class = json.dumps(the_class, sort_keys=True, indent=4, separators=(',', ': '))

response = requests.put(base_url + "/classes/" + args.class_id, data=pretty_class, auth=auth, headers=headers, timeout=300)

if (response and response.status_code == requests.codes.ok):
	print "Class updated successfully"
else:
	print "Class update failed: %s" % response.text






