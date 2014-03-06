'use strict';


var _ = require('lodash');
var mongoose = require('mongoose-q')(require('mongoose'));

var ObjectId = mongoose.Types.ObjectId;

var TrainingClass = mongoose.model('TrainingClass');

exports.getClasses = function() {
    return TrainingClass.find().populate('students.user').execQ();
};

exports.getClass = function(classId) {
    return TrainingClass.findById(classId).populate('students.user').execQ();
};

exports.getClassOfUser = function(userId) {
    return TrainingClass.findOne({'students.user': new ObjectId(userId)}).populate('students.user').execQ();
};

exports.createClass = function(classData) {
    var newClass = new TrainingClass(classData);

    return newClass.saveQ().then(function(entity) {
        return entity.populateQ('students.user');
    });
};

exports.updateClass = function(classId, classData) {
    var updatedClassEntity = _.omit(classData, '_id');
    return TrainingClass.updateQ({_id: new ObjectId(classId)}, updatedClassEntity, {upsert: true});
};

exports.updateStudentApp = function(userId, appId) {
    return TrainingClass.findOne({'students.user': new ObjectId(userId)}).execQ().then(
        function(classEntity) {
            var student = _.find(classEntity.students, function(currentStudent) {
                return currentStudent.user == userId;
            });

            student.apps.push({ravelloId: appId});

            var classData = classEntity.toJSON();
            classData = _.omit(classData, '_id');
            return TrainingClass.updateQ({_id: new ObjectId(classEntity.id)}, classData, {upsert: true});
        }
    );
};

exports.deleteClass = function(classId) {
    return TrainingClass.findByIdAndRemove(classId).populate('students.user').execQ();
};
