const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JobApplication = sequelize.define('JobApplication', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    jobPostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'job_post_id',
        references: {
            model: 'job_posts',
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'rejected', 'accepted'),
        defaultValue: 'pending'
    },
    appliedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: 'applied_at'
    }
}, {
    tableName: 'job_applications',
    timestamps: false
});

module.exports = JobApplication;
