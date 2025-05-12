DROP DATABASE IF EXISTS human_resource_management;
CREATE DATABASE human_resource_management;
USE human_resource_management;

CREATE TABLE Departments (
    depId INT AUTO_INCREMENT PRIMARY KEY,
    depName VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE Posts (
    postId INT AUTO_INCREMENT PRIMARY KEY,
    postTitle VARCHAR(80) NOT NULL
);

CREATE TABLE Staffs (
    employeeId INT AUTO_INCREMENT PRIMARY KEY,
    postId INT NOT NULL,
    depId INT NOT NULL,
    firstName VARCHAR(80) NOT NULL,
    lastName VARCHAR(80) NOT NULL,
    gender ENUM('Male', 'Female') NOT NULL,
    DOB DATE NOT NULL,
    email VARCHAR(80) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    FOREIGN KEY (depId) REFERENCES Departments(depId) ON DELETE CASCADE,
    FOREIGN KEY (postId) REFERENCES Posts(postId) ON DELETE CASCADE
);

CREATE TABLE Users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    employeeId INT NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    FOREIGN KEY (employeeId) REFERENCES Staffs(employeeId) ON DELETE CASCADE
);


CREATE TABLE Recruitment (
    recId INT AUTO_INCREMENT PRIMARY KEY,
    hireDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    salary DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'active', 'terminated') NOT NULL DEFAULT 'pending',
    employeeId INT NOT NULL,
    FOREIGN KEY (employeeId) REFERENCES Staffs(employeeId) ON DELETE CASCADE
);
