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
    - `subActivity`  *(if the activity definition contains subActivities: required & must be one among the defined subActivities ; else: optional, string)*
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
### `/activities/save-untrackable-activity`
- **Method:** PUT
- **Description:** To save an untrackable activity
- **Request Headers:**
    - `authorization`  *(required, string)* : Bearer Token (JWT token of the session)
- **Request Body:**
    - `activityName`  *(required, string)*
    - `subActivity`  *(if the activity definition contains subActivities: required & must be one among the defined subActivities ; else: optional, string)*
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


#
<h1 style="text-align: center;"> Sample Requests/Responses </h1>

### Example : `/activities/get-defined-activities`
- **Response Code :**  `200 OK`
```json
// JSON

{
    "definedActivitiesParameters": [
        {
            "_id": "65f17059817e57031fe7e760",
            "isActive": true,
            "activityName": "Walk",
            "isTrackable": true,
            "activityParameters": {
                "map": "Object",        // Map is actually of type Array, but js returns "object" for `typeof [1,2,3]`
                "avgSpeed": "Number",
                "steps": "Number",
                "distance": "Number",
                "calories": "Number",
                "elevationGain": "Number"
            },
            "subActivities": [],
            "createdAt": "2024-03-13T09:22:33.223Z",
            "updatedAt": "2024-03-13T09:22:33.224Z",
            "__v": 0
        },
        {
            "_id": "65f17059817e57031fe7e761",
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
            "subActivities": [],
            "createdAt": "2024-03-13T09:22:33.224Z",
            "updatedAt": "2024-03-13T09:22:33.224Z",
            "__v": 0
        },
        {
            "_id": "65f17059817e57031fe7e762",
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
            "subActivities": [],
            "createdAt": "2024-03-13T09:22:33.224Z",
            "updatedAt": "2024-03-13T09:22:33.224Z",
            "__v": 0
        },
        {
            "_id": "65f17059817e57031fe7e763",
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
            "subActivities": [],
            "createdAt": "2024-03-13T09:22:33.225Z",
            "updatedAt": "2024-03-13T09:22:33.225Z",
            "__v": 0
        },
        {
            "_id": "65f17059817e57031fe7e764",
            "isActive": true,
            "activityName": "Gym",
            "isTrackable": false,
            "activityParameters": {
                "weight": "Number",
                "sets": "Number",
                "repsPerSet": "Number"
            },
            "subActivities": [
                "Barbell Curls",
                "Barbell Rows",
                "Bench Press",
                "Bent-Over Rows",
                "Bicep Curls / Dumbell Curls Dips",
                "Deadlifts",
                "Leg Curls",
                "Squats",
                "Agility Ladder Drills",
                "Box Jumps",
                "High Knees",
                "Jump Rope",
                "Jump Squats"
            ],
            "createdAt": "2024-03-13T09:22:33.225Z",
            "updatedAt": "2024-03-13T09:22:33.225Z",
            "__v": 0
        },
        {
            "_id": "65f17059817e57031fe7e765",
            "isActive": true,
            "activityName": "Yoga",
            "isTrackable": false,
            "activityParameters": {
                "count": "Number"
            },
            "subActivities": [],
            "createdAt": "2024-03-13T09:22:33.225Z",
            "updatedAt": "2024-03-13T09:22:33.225Z",
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
            "comments": "Ran 15km today",
            "_id": "65f170b842b3357617800105"
        },
        {
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
            "comments": "Walked in the park",
            "_id": "65f172a8d633c8d94dd1d4f5"
        }
    ],
    "untrackableActivitiesHistory": [
        {
            "activityName": "Gym",
            "subActivity": "Bench Press",
            "startTime": "2022-01-01T03:00:00.000Z",
            "endTime": "2022-01-01T03:30:00.000Z",
            "parameters": {
                "weight": 15,
                "sets": 3,
                "repsPerSet": 7
            },
            "comments": "Did 3 sets of 15 reps",
            "_id": "65f172b5d633c8d94dd1d4fb"
        },
        {
            "activityName": "Gym",
            "subActivity": "Squats",
            "startTime": "2022-01-01T03:30:00.000Z",
            "endTime": "2022-01-01T04:00:00.000Z",
            "parameters": {
                "weight": 10,
                "sets": 3,
                "repsPerSet": 10
            },
            "comments": "Did 3 sets of 10 reps",
            "_id": "65f172bfd633c8d94dd1d502"
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
    "comments": "Ran 15km today"
}
```
---
### Example : `/activities/save-untrackable-activity`
- **Request Body :**
```json
// JSON

{
    "activityName": "Gym",
    "subActivity": "Bench Press",
    "startTime": "2022-01-01T03:00:00Z",
    "endTime": "2022-01-01T03:30:00Z",
    "weight": 15,
    "sets": 3,
    "repsPerSet": 7,
    "comments": "Did 3 sets of 15 reps"
}
```