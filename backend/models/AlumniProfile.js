const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AlumniProfile = sequelize.define('AlumniProfile', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id'
        }
    },
    graduationYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'graduation_year',
        validate: {
            min: 1950,
            max: new Date().getFullYear() + 5
        }
    },
    department: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    degree: {
        type: DataTypes.STRING(255),
        defaultValue: ''
    },
    company: {
        type: DataTypes.STRING(255),
        defaultValue: ''
    },
    position: {
        type: DataTypes.STRING(255),
        defaultValue: ''
    },
    city: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        field: 'city'
    },
    state: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        field: 'state'
    },
    country: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        field: 'country'
    },
    bio: {
        type: DataTypes.TEXT,
        defaultValue: ''
    },
    linkedin: {
        type: DataTypes.STRING(500),
        defaultValue: ''
    },
    github: {
        type: DataTypes.STRING(500),
        defaultValue: ''
    },
    website: {
        type: DataTypes.STRING(500),
        defaultValue: ''
    },
    phone: {
        type: DataTypes.STRING(50),
        defaultValue: ''
    },
    showEmail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'show_email'
    },
    showPhone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'show_phone'
    },
    showLocation: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'show_location'
    },
    skills: {
        type: DataTypes.TEXT,
        defaultValue: null,
        get() {
            const value = this.getDataValue('skills');
            return value ? JSON.parse(value) : [];
        },
        set(value) {
            this.setDataValue('skills', value ? JSON.stringify(value) : null);
        }
    }
}, {
    tableName: 'alumni_profiles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Virtual for location object
AlumniProfile.prototype.getLocation = function() {
    return {
        city: this.city,
        state: this.state,
        country: this.country
    };
};

AlumniProfile.prototype.setLocation = function(location) {
    if (location) {
        this.city = location.city || '';
        this.state = location.state || '';
        this.country = location.country || '';
    }
};

module.exports = AlumniProfile;
