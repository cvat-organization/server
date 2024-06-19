<h1 style="text-align: center;"> API Documentation </h1>


<h1 style="text-align: center;"> Index </h1>

### /auth/ - Authentication
- [`/auth/register`](#authregister)
- [`/auth/login`](#authlogin)   
- [`/auth/oauth/oauth-google`](#authoauthoauth-google)
- [`/auth/account/request-otp`](#authaccountrequest-otp)
- [`/auth/account/verify-otp`](#authaccountverify-otp)
- [`/auth/account/new-password`](#authaccountnew-password)
### /profile/ - User Profile Actions
- [`/profile/get-user-profile`](#profileget-user-profile)
- [`/profile/update-user-profile`](#profileupdate-user-profile)
- [`/profile/request-pwd-change`](#profilerequest-pwd-change)
- [`/profile/logout`](#profilelogout)
### /activities - Activities Related
- [`/activities/get-defined-activities`](#activitiesget-defined-activities)
- [`/activities/get-activities-history`](#activitiesget-activities-history)
- [`/activities/save-trackable-activity`](#activitiessave-trackable-activity)
- [`/activities/save-untrackable-activity`](#activitiessave-untrackable-activity)
- [`/activities/delete-trackable-activity`](#activitiesdelete-trackable-activity)
- [`/activities/delete-untrackable-activity`](#activitiesdelete-untrackable-activity)
### /daily-summaries - Daily User Statistics
- [`/daily-summaries/get-periodic-summaries-history`](#daily-summariesget-periodic-summaries-history)
- [`/daily-summaries/update-daily-summaries`](#daily-summariesupdate-daily-summaries)
### /admin - Admin Related
- [`/admin/dashboard/get-users-vs-time`](#admindashboardget-users-vs-time)
- [`/admin/vendor/register`](#adminvendorregister)
- [`/admin/vendor/upload-certificates`](#adminvendorupload-certificates)
- [`admin/users/read`](#adminusersread)
- [`admin/users/update`](#adminusersupdate)

#
<h1 style="text-align: center;"> Endpoints </h1>

### `/auth/register`
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
### `/auth/login`
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
### `/profile/logout`
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
### `/auth/account/request-otp`
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
### `/auth/account/verify-otp`
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
### `/auth/account/new-password`
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
### `/profile/request-pwd-change`
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
### `/auth/oauth/oauth-google`
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
### `/profile/get-user-profile`
- **Method:** GET
- **Description:** To retrieve a user's profile data
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Response:**
    - `200 OK` : Successful retrieval  
    **Response object :**
        - *message (String)*
        - *fullName (String)*
        - *displayName (String)*
        - *trackerID (String)*
        - *email (String)*
        - *phoneNo (String)*
        - *followers (Array)*
        - *incomingFollowRequests (Array)*
        - *following (Array)*
        - *bio (String)*
        - *website (String)*
        - *location (String)*
        - *gender (String)*
        - *birthYear (Number)*
        - *metric (String)*
        - *height (Number)*
        - *weight (Number)*
        - *stepLengthCM (Number)*
        - *subscriptionStatus (String)*
        - *profilePicture (String)* : base64 String encoded format
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
### `/profile/update-user-profile`
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
    - `birthYear`  *(optional, Number)*
    - `metric`  *(optional, string)*
    - `height`  *(optional, Number)*
    - `weight`  *(optional, Number)*
    - `stepLengthCM`  *(optional, Number)*
    - `profilePicture`  *(optional, string)* : base64 String encoded format
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
---
### `/activities/get-defined-activities`
- **Method:** GET
- **Description:** To retrieve all the defined activities & their parameters
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Response:**
    - `200 OK` : Successully retrieved all pre-defined activities & their parameters  
    **Response object :**
        - *definedActivitiesParameters* : *(Array of Objects)*
            ```js
            [
                {
                    isActive: Boolean,
                    activityName: String,
                    isTrackable: Boolean,
                    activityParameters: Object,    // See `definedActivities.json` for the params and data types
                    subActivities: Array,
                },
                ...
            ]
            ```
            ***See [Example](#example--activitiesget-defined-activities)***
    - `400 Bad Request` : Invalid request headers  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Token expired or invalid  
    **Response object :**
        - *message*
    - `404 Not Found` : No pre-defined activities found  
    **Response object :**
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/activities/get-activities-history`
- **Method:** GET
- **Description:** To retrieve a user's complete activities history
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Response:**
    - `200 OK` : Activities history retrieved successfully  
    **Response object :**
        - *message*
        - *trackableActivitiesHistory  (Array)*
        - *untrackableActivitiesHistory  (Array)*
            ```js
            // trackableActivitiesHistory Array
            [
                {
                    activityName: String,
                    subActivity: String,    // Optional, may be undefined
                    startTime: String,
                    endTime: String,
                    parameters: Object,
                    comments: String,   // Optional, may be undefined
                }
                ...
            ]
            ```
            ***See [Example](#example--activitiesget-activities-history)***
    - `400 Bad Request` : Invalid request headers  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Token expired or invalid  
    **Response object :**
        - *message*
    - `404 Not Found` : No activities history found  
    **Response object :**
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/activities/save-trackable-activity`
- **Method:** PUT
- **Description:** To save a trackable activity
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Request Body:**
    - `activityName`  *(required, string)*
    - `subActivityTree`  *(if the activity definition contains subActivities: required & should follow the same hierarchy ; else: optional, object)*
    - `startTime`  *(required, string)* : Must follow ISO 8601 Standard
    - `endTime`  *(required, string)* : Must follow ISO 8601 Standard
    - `*parameters`  *(required, string)* : Each individual parameter defined for the activity must be specified separately in req body
    - `thumbnail`  *(optional, string)* : Map thumbnail in base64 String encoded format
    - `comments`  *(optional, string)*  
    ***See [Example](#example--activitiessave-trackable-activity)***
- **Response:**
    - `200 OK` : Activity saved successfully  
    **Response object :**
        - *message*
        - *activityHistoryID (string)*  : Store this to delete/edit the activity in future
    - `400 Bad Request` : Invalid request headers/body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Token expired or invalid  
    **Response object :**
        - *message*
    - `404 Not Found` : Activity is not one among the pre-defined ones  
    **Response object :**
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/activities/save-untrackable-activity`
- **Method:** PUT
- **Description:** To save an untrackable activity
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Request Body:**
    - `activityName`  *(required, string)*
    - `subActivityTree`  *(if the activity definition contains subActivities: required & should follow the same hierarchy ; else: optional, object)*
    - `startTime`  *(required, string)* : Must follow ISO 8601 Standard
    - `endTime`  *(required, string)* : Must follow ISO 8601 Standard
    - `*parameters`  *(required, string)* : Each individual parameter defined for the activity must be specified separately in req body
    - `comments`  *(optional, string)*  
    ***See [Example](#example--activitiessave-untrackable-activity)***
- **Response:**
    - `200 OK` : Activity saved successfully  
    **Response object :**
        - *message*
        - *activityHistoryID (String)*  : Store this to delete/edit the activity in future
    - `400 Bad Request` : Invalid request headers/body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Token expired or invalid  
    **Response object :**
        - *message*
    - `404 Not Found` : Activity is not one among the pre-defined ones   
    **Response object :**
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/activities/delete-trackable-activity`
- **Method:** DELETE
- **Description:** To delete a trackable activity from history
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Request Body:**
    - `activityHistoryID`  *(required, string)*
- **Response:**
    - `200 OK` : Activity deleted successfully  
    **Response object :**
        - *message*
    - `400 Bad Request` : Invalid request headers/body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Token expired or invalid  
    **Response object :**
        - *message*
    - `404 Not Found` : Activity not found  
    **Response object :**
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/activities/delete-untrackable-activity`
- **Method:** DELETE
- **Description:** To delete an untrackable activity from history
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Request Body:**
    - `activityHistoryID`  *(required, string)*
- **Response:**
    - `200 OK` : Activity deleted successfully  
    **Response object :**
        - *message*
    - `400 Bad Request` : Invalid request headers/body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Token expired or invalid  
    **Response object :**
        - *message*
    - `404 Not Found` : Activity not found  
    **Response object :**
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*  
---
### `/daily-summaries/get-periodic-summaries-history`
- **Method:** GET
- **Description:** To retrieve history of daily, weekly & monthly user statistics
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Response:**
    - `200 OK` : Periodic summaries history retrieved successfully  
    **Response object :**
        - *message*
        - *daily (Object)*
            ```js
            {
                dates: Array,
                steps: Array,
                calories: Array,
                distances: Array,
                stepsGoals: Array,
                goalAchieved: Array
            }
            ```
        - *weekly (Object)*
            ```js
            {
                dates: Array,
                steps: Array,
                calories: Array,
                distances: Array,
            }
            ```
        - *monthly (Object)*  
         ***Same format as weekly***
    - `400 Bad Request` : Invalid request headers  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Token expired or invalid  
    **Response object :**
        - *message*
    - `404 Not Found` : No summaries found  
    **Response object :**
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*  
---
### `/daily-summaries/update-daily-summaries`
- **Method:** PUT
- **Description:** To update daily user statistics
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Request Body:**
    - `summaries`  *(required, Array)* : Each element of the array must be an **Object** containing:
        - ***date***  *(required, string)* : Must follow ISO 8601 Standard
        - ***steps***  *(required, Number)*
        - ***calories***  *(required, Number)*
        - ***distance***  *(required, Number)*
        - ***stepsGoal***  *(required, Number)*
- **Response:**
    - `200 OK` : Updated successfully  
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
---
### `/admin/dashboard/get-users-vs-time`
- **Method:** GET
- **Description:** To retrieve no. of users vs time data
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Request Body:**
    - `userType`  *(required, string)* : Counts of this userType will be returned
- **Response:**
    - `200 OK` : Users vs time data retrieved successfully  
    **Response object :**
        - *message*
        - *dates (Array)*
        - *counts (Array)*
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
### `/admin/vendor/register`
- **Method:** POST
- **Description:** To register a new vendor
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Request Body:**
    - `businessName`  *(required, string)*
    - `businessDisplayName`  *(required, string)*
    - `businessEmail`  *(required, string)*
    - `businessContactNo`  *(required, string)*
    - `businessWebsite`  *(optional, string)*
    - `businessAddress`  *(optional, string)*
    - `businessDomain`  *(optional, string)*
    - `subCategories`  *(optional, array)*
    - `businessDescription`  *(optional, string)*
    - `businessLogo`  *(optional, string)* : base64 String encoded format
    - `serviceType`  *(optional, string)*
    - `contactPersonName`  *(optional, string)*
    - `contactPersonEmail`  *(optional, string)*
    - `contactPersonPhoneNo`  *(optional, string)*
    - `contactPersonDesignation`  *(optional, string)*
    - `isContactPersonDecisionMaker`  *(optional, boolean)*
- **Respone:**
    - `201 Created` : Vendor registered successfully  
    **Response object :** 
        - *message*
    - `400 Bad Request` : Invalid request headers/body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Token expired or invalid  
    **Response object :** 
        - *message*
    - `409 Conflict` : Existing businessEmail/businessContactNo  
    **Response object :** 
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/admin/vendor/upload-certificates`
- **Method:** PUT
- **Description:** To upload a vendor's business certificates
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
    - `businessEmail`  *(required, string)*
- **Request Body: Multipart/Form-data**
    - `incorporationCertificate`  *(required, file)* : PDF File
    - `gst`  *(required, file)* : PDF File
    - `pan`  *(required, file)* : PDF File
- **Respone:**
    - `200 OK` : Business certificates uploaded successfully  
    **Response object :** 
        - *message*
    - `400 Bad Request` : Invalid request headers/body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Token expired or invalid  
    **Response object :** 
        - *message*
    - `404 Not Found` : Vendor not found  
    **Response object :** 
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*
---
### `/admin/users/read`
- **Method:** GET
- **Description:** To retrieve the complete users collection
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Response:**
    - `200 OK` : Users data retrieved successfully  
    **Response object :**
        - *message*
        - *usersData (Array)*
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
### `/admin/users/update`
- **Method:** PUT
- **Description:** To update the users collection
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Request Body:**
    - `_id`  *(**required**, string)*
    - `fullName`  *(optional, string)*
    - `displayName`  *(optional, string)*
    - `email`  *(optional, string)*
    - `password`  *(optional, string)*
    - `phoneNo`  *(optional, string)*
    - `userType`  *(optional, string)*
    - `trackerID`  *(optional, string)*
    - `createdBy`  *(optional, string)*
    - `updatedBy`  *(optional, string)*
    - `bio`  *(optional, string)*
    - `gender`  *(optional, string)*
    - `metric`  *(optional, string)*
    - `profilePicture`  *(optional, string)* : base64 String encoded format
    - `website`  *(optional, string)*
    - `location`  *(optional, string)*
    - `businessWebsite`  *(optional, string)*
    - `businessAddress`  *(optional, string)*
    - `businessDomain`  *(optional, string)*
    - `businessDescription`  *(optional, string)*
    - `businessLogo`  *(optional, string)* : base64 String encoded format
    - `serviceType`  *(optional, string)*
    - `contactPersonName`  *(optional, string)*
    - `contactPersonEmail`  *(optional, string)*
    - `contactPersonPhoneNo`  *(optional, string)*
    - `contactPersonDesignation`  *(optional, string)*
    - `subscriptionStatus`  *(optional, string)*
    - `subCategories`  *(optional, array)*
    - `followers`  *(optional, array)*
    - `incomingFollowRequests`  *(optional, array)*
    - `following`  *(optional, array)*
    - `isActive`  *(optional, boolean)*
    - `isLoggedIn`  *(optional, boolean)*
    - `isContactPersonDecisionMaker`  *(optional, boolean)*
    - `incorrectAttemptsCount`  *(optional, number)*
    - `__v`  *(optional, number)*
    - `birthYear`  *(optional, number)*
    - `height`  *(optional, number)*
    - `weight`  *(optional, number)*
    - `stepLengthCM`  *(optional, number)*
    - `suspendedTill`  *(optional, string)* : Must follow ISO 8601 Standard
    - `createdAt`  *(optional, string)* : Must follow ISO 8601 Standard
    - `updatedAt`  *(optional, string)* : Must follow ISO 8601 Standard
- **Response:**
    - `200 OK` : Users collection updated successfully  
    **Response object :**
        - *message*
    - `400 Bad Request` : Invalid request headers/body  
    **Response object :** 
        - *message*
    - `401 Unauthorized` : Token expired or invalid  
    **Response object :**
        - *message*
    - `404 Not Found` : User not found. _id is invalid  
    **Response object :**
        - *message*
    - `500 Internal Server Error`  
    **Response object :** 
        - *message*  


#
<h1 style="text-align: center;"> Sample Requests/Responses </h1>

### Example : `/activities/get-defined-activities`
- **Response Code :**  `200 OK`
```json
// JSON

{
    "definedActivitiesParameters": [
        {
            "_id": "663c9125e908f285a4634fd3",
            "isActive": true,
            "activityName": "Walk",
            "isTrackable": true,
            "activityParameters": {
                "map": "Object",
                "avgSpeed": "Number",
                "steps": "Number",
                "distance": "Number",
                "calories": "Number",
                "elevationGain": "Number"
            },
            "hasSubActivities": false,
            "createdAt": "2024-05-09T09:02:29.260Z",
            "updatedAt": "2024-05-09T09:02:29.260Z",
            "__v": 0
        },
        {
            "_id": "663c9125e908f285a4634fd4",
            "isActive": true,
            "activityName": "Run",
            "isTrackable": true,
            "activityParameters": {
                "map": "Object",
                "avgSpeed": "Number",
                "steps": "Number",
                "distance": "Number",
                "calories": "Number",
                "elevationGain": "Number"
            },
            "hasSubActivities": false,
            "createdAt": "2024-05-09T09:02:29.262Z",
            "updatedAt": "2024-05-09T09:02:29.262Z",
            "__v": 0
        },
        {
            "_id": "663c9125e908f285a4634fd5",
            "isActive": true,
            "activityName": "Hike",
            "isTrackable": true,
            "activityParameters": {
                "map": "Object",
                "avgSpeed": "Number",
                "steps": "Number",
                "distance": "Number",
                "calories": "Number",
                "elevationGain": "Number"
            },
            "hasSubActivities": false,
            "createdAt": "2024-05-09T09:02:29.262Z",
            "updatedAt": "2024-05-09T09:02:29.262Z",
            "__v": 0
        },
        {
            "_id": "663c9125e908f285a4634fd6",
            "isActive": true,
            "activityName": "Ride",
            "isTrackable": true,
            "activityParameters": {
                "map": "Object",
                "avgSpeed": "Number",
                "distance": "Number",
                "calories": "Number",
                "elevationGain": "Number"
            },
            "hasSubActivities": false,
            "createdAt": "2024-05-09T09:02:29.262Z",
            "updatedAt": "2024-05-09T09:02:29.262Z",
            "__v": 0
        },
        {
            "_id": "663c9125e908f285a4634fd7",
            "isActive": true,
            "activityName": "Exercise",
            "isTrackable": false,
            "activityParameters": {
                "weight": "String",
                "sets": "String",
                "reps/time": "String"
            },
            "hasSubActivities": true,
            "subActivities": {
                "Strength Training": {
                    "Upper Body Exercises": [
                        "Barbell Curls",
                        "Barbell Rows",
                        "Bench Press",
                        "Bent-Over Rows",
                        "Bicep Curls / Dumbbell Curls",
                        "Dips",
                        "Dumbbell Flyes",
                        "Dumbbell Rows",
                        "Lat Pulldowns",
                        "Lateral Raises",
                        "Planks",
                        "Pull-Ups",
                        "Push-Ups",
                        "Russian Twists",
                        "Shoulder Press",
                        "Shrugs",
                        "Tricep Extensions"
                    ],
                    "Lower Body Exercises": [
                        "Calf Raises",
                        "Deadlifts",
                        "Leg Curls",
                        "Leg Extensions",
                        "Leg Press",
                        "Lunges",
                        "Romanian Deadlifts",
                        "Squats"
                    ]
                },
                "Functional Cardio": [
                    "Agility Ladder Drills",
                    "Box Jumps",
                    "Burpees",
                    "Butt Kicks",
                    "Cross-Country Skiing",
                    "High Knees",
                    "Jump Rope",
                    "Jump Squats",
                    "Jumping Jacks",
                    "Kickboxing",
                    "Mountain Climbers",
                    "Skaters",
                    "Sprints",
                    "Stair Climbing"
                ],
                "Steady-State Cardio": [
                    "Cycling (Stationary)",
                    "Cycling (Outdoor)",
                    "Dancing (Zumba)",
                    "Dancing (Aerobics)",
                    "Elliptical Training",
                    "Rowing (Machine)",
                    "Rowing (Outdoor)",
                    "Running (Treadmill)",
                    "Running (Outdoor)",
                    "Swimming",
                    "Walking"
                ]
            },
            "createdAt": "2024-05-09T09:02:29.262Z",
            "updatedAt": "2024-05-09T09:02:29.262Z",
            "__v": 0
        },
        {
            "_id": "663c9125e908f285a4634fd8",
            "isActive": true,
            "activityName": "Yoga",
            "isTrackable": false,
            "activityParameters": {
                "count": "String"
            },
            "hasSubActivities": false,
            "createdAt": "2024-05-09T09:02:29.262Z",
            "updatedAt": "2024-05-09T09:02:29.263Z",
            "__v": 0
        },
        {
            "_id": "663c9125e908f285a4634fd9",
            "isActive": true,
            "activityName": "Fasting",
            "isTrackable": false,
            "activityParameters": {
                "fastingDurationGoal": "Number",
                "fastingDurationAchieved": "Number"
            },
            "hasSubActivities": false,
            "createdAt": "2024-05-09T09:02:29.263Z",
            "updatedAt": "2024-05-09T09:02:29.263Z",
            "__v": 0
        },
        {
            "_id": "663c9125e908f285a4634fda",
            "isActive": true,
            "activityName": "Add Weight",
            "isTrackable": false,
            "activityParameters": {
                "weight": "Number"
            },
            "hasSubActivities": false,
            "createdAt": "2024-05-09T09:02:29.263Z",
            "updatedAt": "2024-05-09T09:02:29.263Z",
            "__v": 0
        }
    ]
}
```
---
### Example : `/activities/get-activities-history`
- **Response Code :**  `200 OK`
```json
// JSON

{
    "message": "Activities' (trackable & untrackable) history retrieved successfully",
    "trackableActivitiesHistory": [
        {
            "_id": "663c9acfb60184975dca6a8c",
            "activityName": "Run",
            "startTime": "2022-01-01T00:00:00.000Z",
            "endTime": "2022-01-01T01:00:00.000Z",
            "parameters": {
                "map": [
                    [
                        40.235,
                        40.357
                    ],
                    [
                        40.245,
                        40.367
                    ]
                ],
                "avgSpeed": 15,
                "steps": 20000,
                "distance": 15,
                "calories": 1000,
                "elevationGain": 50
            },
            "thumbnail": "<string>",
            "comments": "Ran 15km today"
        },
        {
            "_id": "663c9ad4b60184975dca6a90",
            "activityName": "Walk",
            "startTime": "2022-01-01T02:00:00.000Z",
            "endTime": "2022-01-01T02:30:00.000Z",
            "parameters": {
                "map": [
                    [
                        50.235,
                        50.357
                    ],
                    [
                        50.245,
                        50.367
                    ]
                ],
                "avgSpeed": 5.5,
                "steps": 4000,
                "distance": 2.75,
                "calories": 300,
                "elevationGain": 10
            },
            "thumbnail": "<string>",
            "comments": "Walked in the park"
        }
    ],
    "untrackableActivitiesHistory": [
        {
            "_id": "663c95ad8428bf23f3ec38df",
            "activityName": "Exercise",
            "subActivityTree": {
                "Strength Training": {
                    "Upper Body Exercises": {
                        "_v": "Bench Press"
                    }
                }
            },
            "startTime": "2022-01-01T03:00:00.000Z",
            "endTime": "2022-01-01T03:30:00.000Z",
            "parameters": {
                "weight": "15kg",
                "sets": "3",
                "reps/time": "7 reps"
            },
            "comments": "Did 3 sets of 7 reps"
        },
        {
            "_id": "663c97edb97a837de5ef25e4",
            "activityName": "Exercise",
            "subActivityTree": {
                "Strength Training": {
                    "Lower Body Exercises": {
                        "_v": "Squats"
                    }
                }
            },
            "startTime": "2022-01-01T03:30:00.000Z",
            "endTime": "2022-01-01T04:00:00.000Z",
            "parameters": {
                "weight": "10",
                "sets": "3",
                "reps/time": "10"
            },
            "comments": "Did 3 sets of 10 reps"
        }
    ]
}
```
---
### Example : `/activities/save-trackable-activity`
- **Request Body :**
```json
// JSON

{
    "activityName": "Run",
    "startTime": "2022-01-01T00:00:00Z",
    "endTime": "2022-01-01T01:00:00Z",
    "map": [[40.235,40.357], [40.245,40.367]],
    "avgSpeed": 15,
    "steps": 20000,
    "distance": 15,
    "calories": 1000,
    "elevationGain": 50,
    "thumbnail": "<string>",
    "comments": "Ran 15km today"
}
```
---
### Example : `/activities/save-untrackable-activity`
- **Request Body :**
```json
// JSON

{
    "activityName": "Exercise",
    "subActivityTree": {
        "Strength Training": {
            "Upper Body Exercises": {
                "_v": "Bench Press"
            }
        }
    },
    "startTime": "2022-01-01T03:00:00Z",
    "endTime": "2022-01-01T03:30:00Z",
    "weight": "15kg",
    "sets": "3",
    "reps/time": "7 reps",
    "comments": "Did 3 sets of 7 reps"
}
```