-- Création de la base de données SFAEdu
CREATE DATABASE IF NOT EXISTS sfaedu_db;
USE sfaedu_db;

-- Table Users (Regroupe Administrator, Student et Teacher)
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,   -- hash bcrypt, ne pas réduire
    email VARCHAR(150) NOT NULL UNIQUE,
    role ENUM('Administrator', 'Student', 'Teacher') NOT NULL
);

-- Table Course
CREATE TABLE cours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    duration VARCHAR(50),
    progress INT DEFAULT 0,
    teacherId INT,
    FOREIGN KEY (teacherId) REFERENCES utilisateurs(id) ON DELETE SET NULL
);

-- Table Chapter
CREATE TABLE chapter (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    duration VARCHAR(50),
    progress INT DEFAULT 0,
    courseId INT NOT NULL,
    FOREIGN KEY (courseId) REFERENCES cours(id) ON DELETE CASCADE
);

-- Table Lesson
CREATE TABLE lesson (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    duration VARCHAR(50),
    progress INT DEFAULT 0,
    chapterId INT NOT NULL,
    FOREIGN KEY (chapterId) REFERENCES chapter(id) ON DELETE CASCADE
);

-- Table Result
CREATE TABLE result (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150),
    grade DECIMAL(5,2),
    examType VARCHAR(100),
    mention VARCHAR(100),
    studentId INT NOT NULL,
    teacherId INT,
    FOREIGN KEY (studentId) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (teacherId) REFERENCES utilisateurs(id) ON DELETE SET NULL
);

-- Table Enrollment
CREATE TABLE enrollment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    studentId INT NOT NULL,
    courseId INT NOT NULL,
    enrollmentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    FOREIGN KEY (courseId) REFERENCES cours(id) ON DELETE CASCADE
);
