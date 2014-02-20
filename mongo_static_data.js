
var adminUser = {
    _id: ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa'),
    firstName : "Admin",
    surname : "",
    username : "admin",
    password : "$2a$10$sYPGeB3jT5teA6s1jPr3UOUZFq3JVxo5F5A/ZZaHJG7Yi2TuLtkM2",
    role : "TRAINER",
    salt : "$2a$10$sYPGeB3jT5teA6s1jPr3UO"
};

var danielUser = {
    _id: ObjectId('111111111111111111111111'),
    firstName : "Daniel",
    surname : "Wolf",
    username : "daniel",
    password : "$2a$10$sYPGeB3jT5teA6s1jPr3UOUZFq3JVxo5F5A/ZZaHJG7Yi2TuLtkM2",
    role : "STUDENT",
    salt : "$2a$10$sYPGeB3jT5teA6s1jPr3UO"
};

var danielStudent  = {
    _id: ObjectId('111111111111111111110000'),
    user: ObjectId('111111111111111111111111'), 
    blueprintPermissions: [
        {
            bpId: '42434571',
            startVms: true,
            stopVms: true,
            console: true
        } 
    ],
    ravelloCredentials: {
        useClassCredentials: false,
        username: 'daniel.wolf@ravellosystems.com',
        password: '!Q@W3e4r'
    }
};

var hadasUser = {
    firstName : "Hadas",
    _id: ObjectId('222222222222222222222222'),
    surname : "Birin",
    username : "hadas",
    password : "$2a$10$sYPGeB3jT5teA6s1jPr3UOUZFq3JVxo5F5A/ZZaHJG7Yi2TuLtkM2",
    role : "STUDENT",
    salt : "$2a$10$sYPGeB3jT5teA6s1jPr3UO"
};

var hadasStudent = {
    _id: ObjectId('222222222222222222220000'),
    user: ObjectId('222222222222222222222222'),
    blueprintPermissions: [
        {
            bpId: '42434571',
            startVms: true,
            stopVms: true,
            console: true
        } 
    ],
    ravelloCredentials: {
        useClassCredentials: false,
        username: 'daniel.wolf@ravellosystems.com',
        password: '!Q@W3e4r'
    }
};

var course01 = {
    _id: ObjectId('cccccccccccccccccccc1111'),
    name: 'course01',
    description: 'tryout course',
    blueprints: [
        {
            bpId: '42434571',
            displayForStudents: 'Environment 01'
        }
    ]
};

var course02 = {
    _id: ObjectId('cccccccccccccccccccc2222'),
    name: 'course02',
    description: 'tryout course 02',
    blueprints: [
        {
            bpId: '42434571',
            displayForStudents: 'Environment 02'
        }
    ]
};

var class01 = {
    _id: ObjectId('cacacacacacacacacaca2222'),
    name: 'class 01',
    courseId: 'cccccccccccccccccccc2222',
    description: 'A tryout class',
    startDate: ISODate("2014-05-02T06:54:00Z"),
    endDate: ISODate("2014-07-02T06:54:00Z"),
    students: [
        danielStudent,
        hadasStudent
    ]
};

db.trainingclasses.remove();
db.trainingcourses.remove();
db.users.remove();

db.users.save(adminUser);
db.users.save(danielUser);
db.users.save(hadasUser);

db.trainingcourses.save(course02);

db.trainingclasses.save(class01);

