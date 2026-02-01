const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    eventType: {
        type: DataTypes.ENUM('networking', 'workshop', 'seminar', 'reunion', 'other'),
        defaultValue: 'networking',
        field: 'event_type'
    },
    organizerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'organizer_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    maxAttendees: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'max_attendees'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    },
    image: {
        type: DataTypes.STRING(500),
        defaultValue: ''
    }
}, {
    tableName: 'events',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Event;
