# Smart Mat Frontend README


## Table of Contents
1. Prerequisites
2. Installation
3. Running the Application
4. Running the tests

---

### 1. Prerequisites
Before starting make sure that the following tools and software are installed on your machine:

- Node.js: [Download Node.js](https://nodejs.org/en/download)

---

### 2. Installation

Download the source code from the repository

---

### 3. Running the Application
1. Make sure you have installed the backend part of the application and that the server is running
2. Open a terminal and navigate to the root folder of the project
3. Run the following commands in order
    -   `npm install`
    -   `npm run serve`
4. Open your preferred browser and go to: `http://localhost:5000`

Thats it, you are all set to start using the application!

---

### 4. Running the tests

This project has two different test types, Unit tests with Vitest and End-To-End tests using Cypress. 

**Running Unit tests:** 

    -   Navigate to the root folder of the project.

    -   Run the following command: npm run test:unit

**Running E2E tests:**

    -   Create a user with following credentials:
            - Email: test@test.com
            - Password: 123456789
    -   Make sure the backend is running 
    -   Run the following command: npm cypress run