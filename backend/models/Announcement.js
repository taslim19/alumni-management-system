const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Announcement = sequelize.define('Announcement', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    postedById: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'posted_by_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    targetAudience: {
        type: DataTypes.JSON,
        defaultValue: ['all'],
        field: 'target_audience',
        get() {
            const value = this.getDataValue('targetAudience');
            return value ? (typeof value === 'string' ? JSON.parse(value) : value) : ['all'];
        },
        set(value) {
            this.setDataValue('targetAudience', JSON.stringify(value));
        }
    },
    isImportant: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_important'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'announcements',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Announcement;
