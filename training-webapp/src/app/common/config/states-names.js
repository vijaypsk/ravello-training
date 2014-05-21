'use strict';

angular.module('trng.config').constant('StatesNames', {
    login: {
        name: 'login'
    },
    admin: {
        name: 'admin',
        profile: {
            name: 'admin.profile'
        },
        trainers: {
            name: 'admin.trainers'
        },
        singleTrainer: {
            name: 'admin.single-trainer'
        }
    },
    trainer: {
        name: 'trainer',
        training: {
            name: 'trainer.training',
            classes: {
                name: 'trainer.training.classes'
            },
            singleClass: {
                name: 'trainer.training.single-class',
                addClass: {
                    name: 'trainer.training.single-class.add-class'
                },
                editClass: {
                    name: 'trainer.training.single-class.edit-class'
                },
                monitorClass: {
                    name: 'trainer.training.single-class.monitor-class'
                },
                singleStudent: {
                    name: 'trainer.training.single-class.single-student'
                }
            },
            courses: {
                name: 'trainer.training.courses'
            },
            singleCourse: {
                name: 'trainer.training.single-course'
            }
        }
    },
    student: {
        name: 'student',
        studentClass: {
            name: 'student.class',
            appsList: {
                name: 'student.class.apps-list'
            },
            singleApp: {
                name: 'student.class.single-app'
            }
        }
    }
});