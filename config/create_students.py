#!/usr/bin/python

import argparse, requests, json

DEFAULT_NUM_OF_STUDENTS = 200
DEFAULT_SERVER_URL = "http://localhost"

REST_BASE_PATH = "/rest"

args = {}
base_url = ''
headers = {}
auth = ()

def parse_args():
	global args

	arg_parser = argparse.ArgumentParser()

	arg_parser.add_argument("class_id", help="The ID of the class")
	arg_parser.add_argument("students_password", help="The basic password each student will have for login")
	arg_parser.add_argument("trainer_username", help="The username of the trainer to access the Training Portal server")
	arg_parser.add_argument("trainer_password", help="The password of the trainer to access the Training Portal server")

	arg_parser.add_argument("-n", "--num_of_students", help="The number of students to create", default=DEFAULT_NUM_OF_STUDENTS, type=int)
	arg_parser.add_argument("--server_url", help="The URL of the server to access too", default=DEFAULT_SERVER_URL)
	arg_parser.add_argument("--override_existing", help="If used, the current students of the class will be deleted. Default: false", default=False, type=bool, const=True, nargs='?')
	arg_parser.add_argument("--base_student_name", help="A string to user as the base for each student's name", default='User')

	args = arg_parser.parse_args()

def init_rest():
	global base_url
	global headers
	global auth

	base_url = args.server_url + REST_BASE_PATH
	headers = {"Content-Type": "application/json"}
	auth = (args.trainer_username, args.trainer_password)

	print 'Base URL: %s' % base_url

def get_class_and_course():
	response = requests.get(base_url + "/classes/" + args.class_id, auth=auth)
	the_class = response.json()
	
	if (not the_class or not the_class['courseId']):
		print 'Could not find class with ID [%d]' % args.class_id
		exit()
	
	response = requests.get(base_url + "/courses/" + the_class['courseId'], auth=auth)
	the_course = response.json()
	
	if (not the_course):
		print 'Could not find the matching course of the class'
		exit()
		
	return (the_class, the_course)
	
def transformBp(bp):
	return {
		 'bpId': int(bp['id']),
		 'startVms': True,
		 'stopVms': True,
		 'restartVms': True,
		 'console': True
	}

def createStudent(index, bpPermissions):
    username = args.base_student_name + str(index + 1)

    return {
		'user': {
			'firstName': 'User',
			'surname': str(index + 1),
			'username': username,
			'password': args.students_password,
		},
		'blueprintPermissions': bpPermissions
	}

parse_args()
init_rest()

the_class, the_course = get_class_and_course()

bpPermissions = [transformBp(bp) for bp in the_course['blueprints']]

initial_index = 0
if (args.override_existing):
    the_class['students'] = []
else:
    initial_index = len(the_class['students'])

new_students = [createStudent(initial_index + i, bpPermissions) for i in range(args.num_of_students)]
the_class['students'].extend(new_students)

pretty_class = json.dumps(the_class, sort_keys=True, indent=4, separators=(',', ': '))

response = requests.put(base_url + "/classes/" + args.class_id, data=pretty_class, auth=auth, headers=headers)

if (response and response.status_code == requests.codes.ok):
	print "Class updated successfully"
else:
	print "Class update failed: %s" % response.text





