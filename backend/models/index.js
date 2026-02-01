const { sequelize } = require('../config/database');
const User = require('./User');
const AlumniProfile = require('./AlumniProfile');
const Event = require('./Event');
const EventRegistration = require('./EventRegistration');
const JobPost = require('./JobPost');
const JobApplication = require('./JobApplication');
const Announcement = require('./Announcement');

// Define associations
User.hasOne(AlumniProfile, { foreignKey: 'user_id', onDelete: 'CASCADE' });
AlumniProfile.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Event, { foreignKey: 'organizer_id', as: 'organizedEvents' });
Event.belongsTo(User, { foreignKey: 'organizer_id', as: 'organizer' });

User.belongsToMany(Event, { 
    through: EventRegistration, 
    foreignKey: 'user_id', 
    as: 'registeredEvents' 
});
Event.belongsToMany(User, { 
    through: EventRegistration, 
    foreignKey: 'event_id', 
    as: 'registeredUsers' 
});

User.hasMany(JobPost, { foreignKey: 'posted_by_id', as: 'postedJobs' });
JobPost.belongsTo(User, { foreignKey: 'posted_by_id', as: 'postedBy' });

User.belongsToMany(JobPost, { 
    through: JobApplication, 
    foreignKey: 'user_id', 
    as: 'jobApplications' 
});
JobPost.belongsToMany(User, { 
    through: JobApplication, 
    foreignKey: 'job_post_id', 
    as: 'applications' 
});

User.hasMany(Announcement, { foreignKey: 'posted_by_id', as: 'postedAnnouncements' });
Announcement.belongsTo(User, { foreignKey: 'posted_by_id', as: 'postedBy' });

module.exports = {
    sequelize,
    User,
    AlumniProfile,
    Event,
    EventRegistration,
    JobPost,
    JobApplication,
    Announcement
};
