
var adminUser = {
    _id: ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
    firstName : "Admin",
    surname : "",
    username : "admin",
    password : "$2a$10$hQR3dSKHMdANwm1uU3T.1uX6b5HoTZFLbN1YhsM2RggIYaToCOj02",
    role : "ADMIN"
};

db.trainingclasses.remove({ });
db.trainingcourses.remove({ });
db.users.remove({ });

db.users.save(adminUser);

