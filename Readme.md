# MediCare Project

## Overview

MediCare is a web application designed to provide users with health insights, food analysis, and sentiment analysis based on their dietary choices. The application consists of a backend built with Node.js and Express, and a frontend developed using React and Vite.

## Backend

### Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- Bcrypt.js
- dotenv

### Key Features

- User Authentication (Registration and Login)
- Profile Management
- Protected Routes
- Database Connection with Mongoose
- Error Handling

### Endpoints

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Log in an existing user.
- **GET /api/auth/profile**: Get the authenticated user's profile.
- **PUT /api/auth/profile**: Update the authenticated user's profile.
- **GET /api/auth/users**: Get a list of all users (protected route).

## Frontend

### Technologies Used

- React
- Vite
- Tailwind CSS
- Framer Motion
- React Router

### Key Features

- User Authentication (Login and Signup)
- Dashboard with user-specific features
- Food Analyzer for analyzing food items
- Health Insights based on user data
- Sentiment Analysis of dietary choices
- Responsive Design

## Installation

To run the project locally, follow these steps:

1. Clone the repository.
2. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Create a `.env` file in the backend directory and add your MongoDB URI and JWT secret.
4. Start the backend server:
   ```bash
   npm start
   ```
5. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
6. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.
