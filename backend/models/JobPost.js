const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JobPost = sequelize.define('JobPost', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    company: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    employmentType: {
        type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'freelance'),
        defaultValue: 'full-time',
        field: 'employment_type'
    },
    salaryMin: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'salary_min'
    },
    salaryMax: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        field: 'salary_max'
    },
    salaryCurrency: {
        type: DataTypes.STRING(10),
        defaultValue: 'USD',
        field: 'salary_currency'
    },
    requirements: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const value = this.getDataValue('requirements');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('requirements', value ? JSON.stringify(value) : null);
        }
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
    contactEmail: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'contact_email',
        validate: {
            isEmail: true
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'job_posts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Virtual for salary object
JobPost.prototype.getSalary = function() {
    return {
        min: this.salaryMin,
        max: this.salaryMax,
        currency: this.salaryCurrency
    };
};

JobPost.prototype.setSalary = function(salary) {
    if (salary) {
        this.salaryMin = salary.min || null;
        this.salaryMax = salary.max || null;
        this.salaryCurrency = salary.currency || 'USD';
    }
};

module.exports = JobPost;
