CREATE DATABASE human_resource_management;

USE human_resource_management;

CREATE TABLE
    Departments (
        depId INT AUTO_INCREMENT PRIMARY KEY,
        DepName VARCHAR(80) UNIQUE NOT NULL
    );

CREATE TABLE
    Posts (
        postId INT AUTO_INCREMENT PRIMARY KEY,
        postTitle VARCHAR(80) NOT NULL
    );

CREATE TABLE
    Staffs (
        employeeId INT AUTO_INCREMENT PRIMARY KEY,
        postId INT NOT NULL,
        depId INT NOT NULL,
        firstName VARCHAR(80) NOT NULL,
        lastName VARCHAR(80) NOT NULL,
        gender ENUM ('Male', 'Female') NOT NULL,
        DOB VARCHAR(80) NOT NULL,
        email VARCHAR(80) NOT NULL,
        phone INT (10) NOT NULL,
        address VARCHAR(80) NOT NULL,
        FOREIGN KEY (depId) REFERENCES Departments (depId),
        FOREIGN KEY (postId) REFERENCES Posts (postId)
    );

CREATE TABLE
    Users (
        userId INT AUTO_INCREMENT PRIMARY KEY,
        employeeId INT NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        FOREIGN KEY (employeeId) REFERENCES Staffs (employeeId)
    );

CREATE TABLE
    Recruitment (
        recId INT AUTO_INCREMENT PRIMARY KEY,
        hireDate TIMESTAMP NOT NULL,
        salary INT NOT NULL,
        status VARCHAR(255) DEFAULT("pending") NOT NULL,
        employeeId INT NOT NULL,
        FOREIGN KEY (employeeId) REFERENCES Staffs (employeeId)
    )