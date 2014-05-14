# Ravello Training

Workspace for the Training Portal provided by Ravello.

Additional information about the usage of the application can be found [here](http://www.ravellosystems.com/blog/virtual-training-labs-in-the-cloud/?mkt_tok=3RkMMJWWfF9wsRoku6jMZKXonjHpfsX56uooUKGylMI%2F0ER3fOvrPUfGjI4ATstnI%2BSLDwEYGJlv6SgFQ7jDMaNjz7gEXxU%3D).

## Architecture

The application is composed of 3 parts:

1. Client side (in AngularJS).
2. Server to serve the static client files (launched with grunt).
3. Server for REST API, accessed by the client (launched with nodejs).

The two servers are separate.
The client sends requests only to the 1st server, the one launched with grunt, which serves its static files.
The REST calls are also sent to that server. It's that server's responsibility to redirect the requests to the REST server.

There are 2 projects in this codebase - 'training-webapp' for the client, and 'training-sever' for the REST server.
The 'training-webapp' project holds the grunt configuration for running the 1st server (the static one).

## Installing and running

### Prerequisites

- node
- bower
- grunt
- mongoDB

### How to install?

#### Static server (for client files)
1. cd training-webapp

2. npm install  

3. bower install

4. By default, the application is launched on port 8080. If you would like to change it, you can do so in the Gruntfile.js file, under the 'connect.options' property.

5. grunt

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

To configure the application to it's initial state, run from the root directory:

```
mongo training init_db.js
```

