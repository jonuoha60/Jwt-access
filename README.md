# Learning JavaScript WebTokens

> **Note:** This is a React-based project demonstrating authentication with JWTs (JSON Web Tokens), including login, access token, and refresh token flow.

---

## 1. Install Dependencies

Run the following command to install the required packages:


npm install
This will install both the frontend and backend dependencies, including:

react, react-dom

axios for HTTP requests

express, jsonwebtoken, bcrypt for the backend

cookie-parser and cors for server configuration

---

## 2. Running the Project
Backend
Navigate to the backend folder (if separate):

bash
Copy
Edit
cd backend
Start the server:

bash
Copy
Edit
npm start
The backend runs on http://localhost:3000 by default.

Make sure to use cookie-parser and enable CORS with credentials for token handling.

Frontend
Navigate to the frontend folder :

cd frontend
Start the React development server:


npm start
The frontend runs on http://localhost:3001 by default.

Axios requests are configured to send Authorization headers and cookies to handle JWT authentication.
---

## 3. Features
User login with email and password

Password hashing with bcrypt

JWT-based authentication

Short-lived access token

Long-lived refresh token stored in HTTP-only cookies

Automatic token refresh when access token expires

Protected routes that require authentication

Example of posting and retrieving user-specific data

## 4. Usage
Register a new user via the backend API or seed database.

Login from the frontend to obtain an access token and set the refresh token cookie.

Access protected routes, e.g., fetch user-created movies.

If the access token expires, the frontend automatically requests a new one using the refresh token.

## 5. Notes / Best Practices
Access tokens should have short expiration times (15m–1h) for security.

Refresh tokens should be stored securely, preferably in HTTP-only cookies.

For production, set secure: true and sameSite: "None" for cookies over HTTPS.

In-memory storage for refresh tokens (refreshTokens array) is only suitable for testing; consider a database for persistence.

Make sure your CORS policy allows credentials if using cookies.

6. References
JWT Official Documentation

Express Documentation

React Documentation
