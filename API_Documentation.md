<h1 style="text-align: center;"> API Documentation </h1>

## Authentication
The authentication mechanism used in the provided API involces JSON Web Tokens (JWT) for user authentication. Here's an overview of how it works:

1. **User Registration:** When a user registers, their credentials (phone/email, password, etc.) are securely stored in the database after being hashed.

2. **User Login:** Upon successful login, the server generates a JWT containing information about the user (such as user ID) and signs it using a secret key (stored in the server's ENV variables).

3. **Token Verification:** The client includes the JWT in all subsequent request headers. The server verifies the token's signature using the secret key, and sends the requested data back to the client if verified; otherwise, it denies access.


---
## Endpoints
### `/register`
- **Method:** POST
- **Description:** To register a new user
- **Request Body:**
    - `firstName`  *(required, string)*
    - `lastName`  *(optional, string)*
    - `phoneNo`  *(required, string)*
    - `email`  *(required, string)*
    - `password`  *(required, string)*
    - `userType` *(required, string)* : Must be one among {"Customer", "Vendor", "Superuser"}
- **Respone:**
    - `201 Created` : User registered successfully
    - `400 Bad Request` : Invalid request body
    - `409 Conflict` : Existing phoneNo/username
    - `500 Internal Server Error`
---
### `/login`
- **Method:** POST
- **Description:** To log in an existing user
- **Request Body:**
    - `phoneNo`  | | `email`  *(any 1 required, string)*
    - `password`  *(required, string)*
    - `userType` *(required, string)* : Must be one among {"Customer", "Vendor", "Superuser"}
- **Response:**
    - `200 OK` : Successfull login. **Response object - {`token`: &lt;token *string*&gt;}**
    - `400 Bad Request` : Invalid request body
    - `401 Unauthorized` : Invalid username or password
    - `403 Forbidden` : User temporarily suspended
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
    - `401 Unauthorized` : Unauthenticated token / Session not found
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
    - `401 Unauthorized` : Unauthenticated token / Session not found
    - `500 Internal Server Error`