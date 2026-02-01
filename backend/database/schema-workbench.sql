-- Alumni Management System - MySQL Database Schema
-- Optimized for MySQL Workbench execution
-- 
-- Instructions:
-- 1. Open MySQL Workbench
-- 2. Connect to your MySQL server
-- 3. Execute this entire script (Ctrl+Shift+Enter or click Execute)
-- 4. Or execute section by section

-- ============================================
-- STEP 1: Create Database
-- ============================================
DROP DATABASE IF EXISTS alumni_management;
CREATE DATABASE alumni_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE alumni_management;

-- ============================================
-- STEP 2: Create Tables
-- ============================================

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'alumni', 'student') DEFAULT 'alumni',
    is_approved BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_photo VARCHAR(500) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_approved (is_approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Alumni Profiles Table
CREATE TABLE alumni_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    graduation_year INT NOT NULL,
    department VARCHAR(255) NOT NULL,
    degree VARCHAR(255) DEFAULT '',
    company VARCHAR(255) DEFAULT '',
    position VARCHAR(255) DEFAULT '',
    city VARCHAR(255) DEFAULT '',
    state VARCHAR(255) DEFAULT '',
    country VARCHAR(255) DEFAULT '',
    bio TEXT,
    linkedin VARCHAR(500) DEFAULT '',
    github VARCHAR(500) DEFAULT '',
    website VARCHAR(500) DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    show_email BOOLEAN DEFAULT FALSE,
    show_phone BOOLEAN DEFAULT FALSE,
    show_location BOOLEAN DEFAULT TRUE,
    skills TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_graduation_year (graduation_year),
    INDEX idx_department (department),
    INDEX idx_company (company)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Events Table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    event_type ENUM('networking', 'workshop', 'seminar', 'reunion', 'other') DEFAULT 'networking',
    organizer_id INT NOT NULL,
    max_attendees INT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    image VARCHAR(500) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_date (date),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Event Registrations (Many-to-Many)
CREATE TABLE event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_registration (event_id, user_id),
    INDEX idx_event_id (event_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Job Posts Table
CREATE TABLE job_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    employment_type ENUM('full-time', 'part-time', 'contract', 'internship', 'freelance') DEFAULT 'full-time',
    salary_min DECIMAL(10, 2) DEFAULT NULL,
    salary_max DECIMAL(10, 2) DEFAULT NULL,
    salary_currency VARCHAR(10) DEFAULT 'USD',
    requirements TEXT,
    posted_by_id INT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_is_active (is_active),
    INDEX idx_company (company)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Job Applications Table
CREATE TABLE job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_post_id INT NOT NULL,
    user_id INT NOT NULL,
    status ENUM('pending', 'reviewed', 'rejected', 'accepted') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_post_id) REFERENCES job_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_job_post_id (job_post_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Announcements Table
CREATE TABLE announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    posted_by_id INT NOT NULL,
    target_audience JSON,
    is_important BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- STEP 3: Verify Tables Created
-- ============================================
SELECT 'Database schema created successfully!' AS Status;
SHOW TABLES;

-- ============================================
-- STEP 4: Create Admin User (Optional)
-- ============================================
-- NOTE: Run the createAdmin.js script instead for proper password hashing
-- Or uncomment and update the password hash below with a proper bcrypt hash
-- 
-- To generate bcrypt hash, run in Node.js:
-- const bcrypt = require('bcryptjs');
-- bcrypt.hash('admin123', 12).then(hash => console.log(hash));
--
-- INSERT INTO users (name, email, password, role, is_approved, is_active) 
-- VALUES ('Admin User', 'admin@example.com', 'YOUR_BCRYPT_HASH_HERE', 'admin', TRUE, TRUE);
