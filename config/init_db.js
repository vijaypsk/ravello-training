
var adminUser = {
    _id: ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
    firstName : "Admin",
    surname : "",
    username : "admin",
    password : "sha256$70dfeb7a$1$73075447efdd78750d87a3cc67a409ddcabab38410c225e33bb4feae879be748",
    role : "ADMIN"
};

db.trainingclasses.remove();
db.trainingcourses.remove();
db.users.remove();

db.users.save(adminUser);

