# Ravello Training

This is a sample project for working with Ravello APIs, in order to create virtual training labs in the cloud 

Additional information on this sample project can be found [here](http://www.ravellosystems.com/blog/virtual-training-labs-in-the-cloud/?mkt_tok=3RkMMJWWfF9wsRoku6jMZKXonjHpfsX56uooUKGylMI%2F0ER3fOvrPUfGjI4ATstnI%2BSLDwEYGJlv6SgFQ7jDMaNjz7gEXxU%3D).

## Architecture

The application is composed of three parts:

1. Client side (in AngularJS).
2. Static server, which serves the static client files.
3. REST API server, which is accessed by the client.

The two servers are separated.
The client sends requests only to the static Web server, which serves its static files.
The REST calls are also sent to that server, which is responsible for redirecting the requests to the REST server.

There are two projects in this codebase - 'training-webapp' for the client, and 'training-sever' for the REST server.
The 'training-webapp' project also holds Grunt configuration for running the static server in development mode.

## Installing and running

### Prerequisites

You need to have the following components installed:
- nodejs
- bower
- grunt
- mongoDB

### How to install?

#### General
1. Set the RAVELLO_TRAINING_HOME environment variable to the root directory of the project, for example:

```
export RAVELLO_TRAINING_HOME=/home/myUser/ravello-training
```

#### Static server (for client files)
1. cd training-webapp

2. npm install  

3. bower install

4. By default, the application is launched on port 8080. If you would like to change it, you can do so in the Gruntfile.js file, under the 'connect.options' property.

5. grunt build

#### REST server
1. cd training-server

2. npm install

### How to run?

#### Development mode
In the root directory, run:  

```
bin/startup_static_server.sh
bin/startup_rest_server.sh
```

Now you can access the application locally at:  
http://localhost:8080

#### Production mode
How to run the application in production is up to you.  
The project provides a basic nginx configuration example, to illustrate how the static server can be launched with nginx: config/nginx.conf.  

**Notice!** The $RAVELLO_TRAINING_HOME variable should be replaced with the actual path of the project's root directory, inside the nfinx.conf file itself, if it's to be actually used.

The REST server should be run the same way as in development mode:

```
config/start_rest_server.sh
```

### Additional configuration

#### Create the applicative MongoDB user
**Important:** the REST server accesses the MongoDB with a username and password.

By default, they are:

username - training

password - training

Use MongoDB to create this user and password.

**It is strongly recommended that you change the password, to something specific to your organization.**

If the password was indeed changed, you'd have to change the properties of the REST server, and set the new password.

Edit the file /Users/danielw/Workspaces/git/ravello_training/training-server/server/modules/config/properties.js, and change the properties 'dbUsername' and 'dbPassword' to match the ones you set in the previous step.

#### Configure the DB
To configure the application to its initial state, run:

```
cd bin
./init_db.sh <username> <password>
```

Where <username> and <password> are the ones determined previously. 

This will create the basic 'admin' user, with which you could create the other application users, and then start using its full functionality.

Note: if you have a fresh installation of mongoDB, you need at least to create the "training" DB and the default "training" user:

Make sure the mongodb is running (you may need to use sudo): 
```
mongod
```

Enter to the mongo command line utility: 
```
mongo
```

Create the training DB:
```
use training
```


You'll be switched to the training DB. Now, add a dummy document to the training DB so it will be saved:
```
db.temp.save( {test:"data"} )
```

Add the training user to the training DB:
```
db.createUser({user:"training", pwd:"training", roles:[{role:"root",db:"admin"}]})
```

Exit the mongo command line utility:
```
exit
```

#### Enable remote access for MongoDB

It might be helpful to open the MongoDB for remote access, to ease later support.
To do so, MongoDB has to be configured to accept remote access.
In addition, since remote access will be enabled, it is recommended to also enable authentication in the DB, so that only authenticated users could access.
A complimentary MongoDB configuration file is supplied, as an example of how to do both: open the DB for remote access, and enable authentication.

This file is in config/mongodb.conf

### Troubleshooting

- Make sure grunt-cli is installed globally, so that the grunt command is found and executed successfully.  

