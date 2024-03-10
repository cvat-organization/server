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
    - `fullName`  *(required, string)*
    - `displayName`  *(required, string)*
    - `phoneNo`  *(required, string)*
    - `email`  *(required, string)*
    - `password`  *(required, string)*
    - `userType` *(required, string)* : Must be one among {"Customer", "Vendor", "Superuser"}
- **Respone:**
    - `201 Created` : User registered successfully  
    **Response object :** 
        - *message*
    - `400 Bad Request` : Invalid request body  
    **Response object :** 
        - *message*
    - `409 Conflict` : Existing phoneNo/username  
    **Response object :** 
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/login`
- **Method:** POST
- **Description:** To log in an existing user
- **Request Body:**
    - `phoneNo`  | | `email`  *(any 1 required, string)*
    - `password`  *(required, string)*
    - `userType` *(required, string)* : Must be one among {"Customer", "Vendor", "Superuser"}
- **Response:**
    - `200 OK` : Successful login.  
    **Response object :**
        - *token* : JWT session token
    - `400 Bad Request` : Invalid request body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Invalid username or password  
    **Response object :** 
        - *message*
    - `403 Forbidden` : User temporarily suspended  
    **Response object :** 
        - *message*
    - `404 Not Found` : User not found  
    **Response object :** 
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/homepage` - Dummy, in development.
- **Method:** GET
- **Description:** Retrieve homepage data
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Response:**
    - `200 OK` : Homepage data retrieved successfully  
    **Response object :** 
        - *message*
    - `400 Bad Request` : Invalid request headers (Token missing?)  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Unauthenticated token / Session not found  
    **Response object :** 
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/logout`
- **Method:** POST
- **Description:** Log out the current user
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Response:**
    - `200 OK` : User logged out successfully  
    **Response object :** 
        - *message*
    - `400 Bad Request` : Invalid request headers (Token missing?)  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Unauthenticated token / Session not found  
    **Response object :** 
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/request-otp`
- **Method:** POST
- **Description:** To request an OTP for pwd reset, **without being logged in**
- **Request Body:**
    - `email`  *(required, string)*
    - `userType` *(required, string)* : Must be one among {"Customer", "Vendor", "Superuser"}
- **Response:**
    - `200 OK` : OTP has been sent to the given email address.  
    ***Response object :***  
        - *message*
    - `400 Bad Request` : Invalid request body  
    **Response object :** 
        - *message*
    - `403 Forbidden` : User temporarily suspended  
    **Response object :** 
        - *message*
    - `404 Not Found` : Email not found in database  
    **Response object :** 
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/verify-otp`
- **Method:** POST
- **Description:** To verify an OTP that was requested for password reset
- **Request Body:**
    - `email`  *(required, string)*
    - `userType` *(required, string)* : Must be one among {"Customer", "Vendor", "Superuser"}
    - `otp`  *(required, string)*
- **Response:**
    - `200 OK` : OTP verified and token is sent to client  
    ***Response object :***  
        - *token* : JWT Token to be included in request header to `/new-password`
    - `400 Bad Request` : Invalid request body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Invalid or expired OTP   
    **Response object :** 
        - *message*
    - `404 Not Found` : OTP request not found in database  
    **Response object :** 
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/new-password`
- **Method:** POST
- **Description:** To change a user's password
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token)
- **Request Body:**
    - `password`  *(required, string)* : New password for the account
- **Response:**
    - `201 OK` : Pwd successfully changed  
    ***Response object :***  
        - *message*`
    - `400 Bad Request` : Invalid request headers/body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Invalid token   
    **Response object :** 
        - *message*
---
### `/request-pwd-change`
- **Method:** POST
- **Description:** To request for password change, **after being logged in**
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Request Body:**
    - `password`  *(required, string)* : Existing or old password for the account
- **Response:**
    - `200 OK` : Old pwd verified and token is sent to client  
    ***Response object :***  
        - *token* : JWT Token to be included in request header to `/new-password`
    - `400 Bad Request` : Invalid request headers/body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Invalid password   
    **Response object :** 
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/oauth-google`
- **Method:** POST
- **Description:** To register/sign-in a user using their Google account
- **Request Headers:**
    - `authorization`  *(required, string)* : idToken (Google idToken)
- **Request Body:**
    - `userType` *(required, string)* : Must be one among {"Customer", "Vendor", "Superuser"}
- **Response:**
    - `200 OK` : Successful login.  
    **Response object :**
        - *token* : JWT session token
    - `201 Created` : User registered successfully  
    **Response object :**
        - *token* : JWT session token
    - `400 Bad Request` : Invalid request headers/body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Token expired or invalid  
    **Response object :**
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/get-user-profile`
- **Method:** GET
- **Description:** To retrieve a user's profile data
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Response:**
    - `200 OK` : Successful retrieval  
    **Response object :**
        - *message*
        - *fullName*
        - *displayName*
        - *trackerID*
        - *email*
        - *phoneNo*
        - *followers (Array)*
        - *incomingFollowRequests (Array)*
        - *following (Array)*
        - *bio*
        - *website*
        - *location*
        - *gender*
        - *birthYear*
        - *metric*
        - *height*
        - *weight*
        - *stepLengthCM*
        - *subscriptionStatus*
        - *profilePicture*
    - `400 Bad Request` : Invalid request headers/body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Token expired or invalid  
    **Response object :**
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/update-user-profile`
- **Method:** PUT
- **Description:** To update a user's profile data
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Request Body:**
    - `fullName`  *(required, string)*
    - `displayName`  *(required, string)*
    - `phoneNo`  *(optional, string)*
    - `bio`  *(optional, string)*
    - `website`  *(optional, string)*
    - `location`  *(optional, string)*
    - `gender`  *(optional, string)*
    - `birthYear`  *(optional, string)*
    - `metric`  *(optional, string)*
    - `height`  *(optional, string)*
    - `weight`  *(optional, string)*
    - `stepLengthCM`  *(optional, string)*
    - `profilePicture`  *(optional, string)*
- **Response:**
    - `200 OK` : User profile data updated successfully  
    **Response object :**
        - *message*
    - `400 Bad Request` : Invalid request headers/body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Token expired or invalid  
    **Response object :**
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*