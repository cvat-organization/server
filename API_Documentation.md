<h1 style="text-align: center;"> API Documentation </h1>

## Authentication
The authentication mechanism used in the provided API involces JSON Web Tokens (JWT) for user authentication. Here's an overview of how it works:

1. **User Registration:** When a user registers, their credentials (username, password, etc.) are securely stored in the database after being hashed.

2. **User Login:** Upon successful login, the server generates a JWT containing information about the user (such as user ID) and signs it using a secret key (stored in the server's ENV variables). A session is containing this token, and the token is then sent back to the client.

3. **Token Verification:** The client includes the JWT in the request headers. The server verifies the token's signature using the secret key. If the token is valid, the server proceeds to check if a session containing this token is open. If so, the requested data is sent to the client; otherwise, it denies access.

4. **Logout:** When a user logs out, the corresponding session token is deleted from the database. This ensures that the token cannot be used again for authentication.

---
## Endpoints
### `/register`
- **Method:** POST
- **Description:** To register a new user
- **Request Body:**
    - `username`  *(required, string)*
    - `password`  *(required, string)*
    - `phoneNo`  *(required, string)*
    - `email`  *(optional, string)*
    - `userType` *(required, string)* : Must be one among {"Customer", "Vendor", "Superuser"}
- **Respone:**
    - `201 Created` : User registered successfully
    - `400 Bad Request` : Invalid request body
    - `409 Conflict` : Existing phoneNo/username
    - `500 Internal Server Error`
---
### `/login`
- **Method:** POST
- **Description:** Log in an existing user
- **Request Body:**
    - `username`  *(required, string)*
    - `password`  *(required, string)*
- **Response:**
    - `200 OK` : User logged in successfully. **Token *(string)* is sent in response body**
    - `400 Bad Request` : Invalid request body
    - `401 Unauthorized` : Invalid username or password
    - `404 Not Found` : User not found
    - `500 Internal Server Error`
---
### `/homepage` - Dummy, in development.
- **Method:** GET
- **Description:** Retrieve homepage data
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Response:**
    - `200 OK` : Homepage data retrieved successfully
    - `400 Bad Request` : Invalid request body (Token missing?)
    - `401 Unauthorized` : Unauthenticated token
    - `404 Not Found` : Session not found
    - `500 Internal Server Error`
---
### `/logout`
- **Method:** post
- **Description:** Log out the current user
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Response:**
    - `200 OK` : User logged out successfully
    - `400 Bad Request` : Invalid request body (Token missing?)
    - `401 Unauthorized` : Unauthenticated token
    - `404 Not Found` : Session not found
    - `500 Internal Server Error`