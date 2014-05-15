# Ravello Training

This is a sample project for working with Ravello APIs, in order to create virtual training labs in the cloud 

Additional information on this sample project can be found [here](http://www.ravellosystems.com/blog/virtual-training-labs-in-the-cloud/?mkt_tok=3RkMMJWWfF9wsRoku6jMZKXonjHpfsX56uooUKGylMI%2F0ER3fOvrPUfGjI4ATstnI%2BSLDwEYGJlv6SgFQ7jDMaNjz7gEXxU%3D).

## Architecture

The application is composed of three parts:

1. Client side (in AngularJS).
2. Static server, which serves the static client files (launched with Grunt).
3. REST API server, which is accessed by the client (launched with nodejs).

The two servers are separated.
The client sends requests only to the Web server that is launched with Grunt, which serves its static files.
The REST calls are also sent to that server, which is responsible for redirecting the requests to the REST server.

There are two projects in this codebase - 'training-webapp' for the client, and 'training-sever' for the REST server.
The 'training-webapp' project holds the Grunt configuration for running the static server.

## Installing and running

### Prerequisites

You need to have the following components installed:
- nodejs
- bower
- grunt
- mongoDB

### How to install?

#### Static server (for client files)
1. cd training-webapp

2. npm install  

3. bower install

4. By default, the application is launched on port 8080. If you would like to change it, you can do so in the Gruntfile.js file, under the 'connect.options' property.

5. Grunt

#### REST server
1. cd training-server

2. npm install

### How to run?
In the root directory, run:  

```
startup_static_server.sh
startup_rest_server.sh
```

Now you can access the application locally at:  
http://localhost:8080

Or externally at:  
http://hostname:8080

### Additional configuration

To configure the application to its initial state, run from the root directory:

```
mongo training init_db.js
```

This creates the basic 'admin' user, with which you could create the other application users, and then start using its full functionality.

