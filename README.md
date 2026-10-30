# Table of Contents
- [Local installation and deployment](#local-installation-and-deployment)
- [Login page](#login-page)
- [Leads page](#leads-page)
- [Rooms page](#rooms-page)
- [Room page](#room-page)
- [Licenses](#licenses)

Welcome to the Real Estate Sample App. This web application was designed to demonstrate the Docusign Rooms API using a sample real estate CRM integration. For more information, see the [Rooms API](https://developers.docusign.com/docs/rooms-api) on the Docusign Developer Center.

While this sample app does not display all of the features of the Rooms API, it does show you how simple and powerful it can be to integrate Rooms features into an existing CRM platform.

The [Real Estate Sample App](https://realestate.sampleapps.docusign.com/) is also deployed on the web!

## Local installation and deployment
1. If you do not already have Node.js installed on your computer, install it from the [Node.js website](https://nodejs.org/en/download/). If you are not sure whether you already have Node.js installed, open up a command-line window and enter:
`npm version`
If you get the current version or a message about a patch, you have Node.js installed. If not, you will need to install it. The app requires Node.js `^22.23.4`, `^24.22.1`, `^26.12.1` or higher.
2. Get a local copy of this repo. This can be done via downloading the repo or cloning the repo on your computer.
3. If you do not already have one, create a [Docusign developer account](https://www.docusign.com/developers/sandbox).
4. Open up a command-line window and change to the room-sample-app folder.
5. In the root folder, create two files: a .env file and a private.key file.
6. Set up the .env file and the private.key file:
    * Log in to your developer account and navigate to the [Apps and Keys](https://admindemo.docusign.com/authenticate?goTo=apiIntegratorKey) page.
    * Under My Apps / Integration Keys, click the ADD APP / INTEGRATION KEY button and enter a name for your integration.
    * Select the newly created integration key and, in the Authentication section, click the button that says '+ ADD RSA KEYPAIR'. Copy the contents of the private key and paste it into your private.key file.
    * In the Addition settings section of the integration key page, add http://localhost:3000 as a Redirect URI.
    * Add the following data to the .env file:
      ```
      NODE_ENV=dev
      USER_ID={a GUID unique to each user's Docusign Account, located on the Apps and Keys page of Docusign eSignature Settings}
      API_ACCOUNT_ID={a GUID unique to each user's Docusign Account, located on the Apps and Keys page of the Docusign eSignature Settings}
      INTEGRATION_KEY={a GUID unique to each application making Docusign API calls. This key was created hwen you added the app and is viewable on the Apps and Keys page of Docusign eSignature Settings}
      SESSION_SECRET={a unique string of your choice used to encrypt the session cookie}
      PRIVATE_KEY_LOCATION=private.key
      TARGET_ACCOUNT_ID=false
      DS_OAUTH_SERVER=https://account-d.docusign.com
      API_URL=http://localhost:5000/api
      FRONTEND_APP_URL=http://localhost:3000
      REACT_APP_SECRET={a unique string of your choice used to encrypT the local storage used by the web app}
      ```
7. Download all of the server Node dependencies by running this command in the root folder:
    `npm install`
8. Download all of the front-end Node dependencies by running this command in the client folder:
    `npm install`
9. Launch the application via the command:
    `npm run dev`
Alternatively, you can run the client and server in two separate command-line windows. Navigate each window to the rooms-sample-app folder and run the following command:

    ```
    // Server terminal
    npm run server
    ```
    ```
    // Client terminal
    npm run client
    ```

11. On most devices, your computer will open up a browser automatically and load the web application. In case it doesn't, open http://localhost:3000 in any browser of your choice to use the web application.

## Login page
The login authentication for this application uses two Docusign Rooms API calls: one to get a JWT and the other to generate a unique ID for each user. Industry CRMs have their own user management and authentication systems; this sample CRM integration leaves these features out. Instead, it focuses on the authentication of the web app to the Docusign API via Docusign JWT authentication.

The front-end login code is contained in:
**/client/src/containers/Login/Login.js**

The back-end login code is contained in:
**/controllers/authcontroller.js** and
**/controllers/officecontroller.js**

### Obtain the JWT token
1. Set up the base paths depending on whether your app is in production or in development, and  then instantiate the Docusign API object.
    ```javascript
    // Get the base paths depending on whether the app is in production or development
    var basePath = (process.env.NODE_ENV === 'prod') ?
      restApi.Api.BasePath.PRODUCTION : restApi.BasePath.DEMO;
    var oAuthBasePath = (process.env.NODE_ENV === 'prod') ?
        oAuth.BasePath.PRODUCTION : oAuth.BasePath.DEMO;
    // Instantiate an API client and set its base path
    var dsApi = new docusign.ApiClient({
        basePath: basePath,
        oAuthBasePath: oAuthBasePath
    });
    ```
2. Get the RSA key from the private.key file and declare the authentication scopes you need for the API. Shown below is a declaration of the scopes available to the Rooms API. As a best practice, only use the scopes required by your application.
    ```javascript
    // Get the RSA key
    rsaKey = fs.readFileSync(process.env.PRIVATE_KEY_LOCATION);
    // Declare the scopes
    const scopes = [
        oAuth.Scope.IMPERSONATION,
        oAuth.Scope.SIGNATURE,
        oAuth.Scope.COMPANY_WRITE,
        oAuth.Scope.COMPANY_READ,
        oAuth.Scope.ROOMS_WRITE,
        oAuth.Scope.ROOMS_READ
    ];
    ```
3. Get the token and add it to the session.
    ```javascript
    // Make the API request to get the token from the server
    results = await dsApi.requestJWTUserToken(process.env.INTEGRATION_KEY,
              process.env.USER_ID, scopes, rsaKey, jwtLifeSec);
    // Add the token and its expiration date to the session
    const expiresAt = moment().add(results.body.expires_in, 's');
      req.session.token = results.body.access_token;
      req.session.tokenExpirationTimestamp = expiresAt;
    ```
4. Finally, now that the session has a token, the token is available to be added to all future API requests. However, before every API request, it is important to ensure that the token has not expired. For this application, this is handled by Express middleware that checks the expiration date of the token in the session cookie of each incoming request, and if the cookie is expired, it replaces it with a new one, just as in the code in step 3.

### Obtain a unique office ID for each user
In a traditional integration, a Rooms account would be made for every CRM user. Either the user’s Rooms account information is stored in the CRM application, or it can be obtained using the Docusign Rooms GetUsers API, which returns the list of users associated with the company, which then can be used to find the Rooms account ID of the current user logged into the CRM. You obtain their USER_ID and API_ACCOUNT_ID by calling the eSignature **userinfo** endpoint. However, in this sample app, everyone is logged in as the same test user. Thus, a call to the GetRooms API would return every room made by every user of this application. To get around this, this application takes advantage of the Room object's officeId field. In a traditional deployment, offices are made by the admin with users being assigned to specific offices. However, what we do here is assign every user a unique office ID. Thus, every Room created is associated with the unique office ID given to each user, making that room only accessible to them. The steps to create a unique office ID for each user are shown below:

1. The unique office ID is stored in local storage using [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard). When the user logs in, the front end checks to see whether the office ID is contained in local storage. If it is, the front end sends this office ID to the back end to be added to the session cookie for future API calls. However, if the office ID is not located in local storage, either the user has never used the app before or has deleted their local storage. A request is then sent to the back end to obtain a new office ID and then store it in local storage. The steps for creating a unique office ID are shown below:
    ```javascript
    //  Instantiate the Docusign apiClient object
    var apiClient = new docusign.ApiClient({
        basePath: basePath,
        oAuthBasePath: oAuthBasePath
    });
    // Add the token to the auth header
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + req.session.token);
    // Instantiate the OfficeApi object
    var officeApi = new docusign.OfficesApi(apiClient);
    // Make the request; try-catch left out for example simplicity
    let response = await officeApi.createOffice(newOffice, process.env.API_ACCOUNT_ID);
    // Get the office ID and add it to the session
    officeId = response.officeId;
    req.session.officeId = officeId;
    ```

## Leads Page
The **Leads** page has four core functions, enabling users to view their leads, create new leads, initiate buy or sell transactions from these leads, and view the latest transaction created by a specific lead.

The front-end login code is contained in:
**/client/src/containers/Leads/Leads.js**

The back-end login code is contained in:
**/controllers/roomsController.js**

Since this is a sample application, instead of using a database to store a user&#39;s leads, the leads are instead encrypted and stored in local storage. If it is a user&#39;s first time visiting the sample application or they have recently cleared their browser&#39;s local storage, the **Login** container detects that there are no contacts in local storage and then loads in a few sample leads from &#39;client/src/assets/localLeads.json&#39; and also adds them to the user&#39;s local storage.

Just as mentioned in the Login section, the info button provides API-specific documentation on how the application performs a specific operation. In this case, the info icon, when clicked, renders a modal dialog box that discusses how to create a **Room** (transaction) via the Rooms API.

All new **leads** are created by the user via the NewLeadForm modal rendered by the **+** button located at the top of the page.

All new **transactions** are created by the user via the **NewsRoomForm** modal rendered by the **Create Transaction** button located in each Lead component. All fields (name, transaction side, address, city, country, state, and zip code) are required and must pass field validation until the submit button is enabled. It is important to note that not all countries and states are supported by the Docusign Rooms API. The supported ones may be obtained via the [GetCountries](https://developers.docusign.com/docs/rooms-api/reference/GlobalResources/Countries/GetCountries) and [GetStates](https://developers.docusign.com/docs/rooms-api/reference/GlobalResources/States/GetStates) API calls. The formData along with the lead data is sent to the back end to construct and send the CreateRoom API call. Upon success, the Rooms page is rendered to the user, with their newly created room showing in the top-left corner. The steps to use the [CreateRoom](https://developers.docusign.com/docs/rooms-api/reference/Rooms/Rooms/CreateRoom) API call are shown below.
1. Get the API Client and add the auth header:
    ```javascript
    var apiClient = new docusign.ApiClient({
        basePath: basePath,
        oAuthBasePath: oAuthBasePath
    });
    ```
2. Get the role ID based upon the user's authorization level. This application uses 'agent' as the default authorization.
    ```javascript
    var rolesApi = new docusign.RolesApi(apiClient);
    try{
      roleResponse = await rolesApi.getRoles(process.env.API_ACCOUNT_ID);
      agentRoleId = null;
      // Get the agent role. For your application users may have different roles
      // In this case, look for the roleID for the role your user is authenticated for
      for(let i = 0; i < roleResponse.roles.length; i++) {
        if(roleResponse.roles[i].name === 'Agent') {
          agentRoleId = roleResponse.roles[i].roleId;
          break;
        }
      }
    ```
3. Build the new room object from the front-end form data:
    ```javascript
    const data = {}
    data.name = req.body.name;
    data.roleId = agentRoleId;
    data.transactionSideId = req.body.side;
    data.ownerId = req.session.roomsID;
    data.officeId = Number(req.session.officeId);
    const fieldData = {};
    fieldData.data = {};
    fieldData.data.postalCode = req.body.postalCode;
    fieldData.data.state = req.body.state;
    fieldData.data.city = req.body.city;
    fieldData.data.address1 = req.body.address1;

      // Add the buyer or seller info
    if(req.body.side ==='sell') {
      fieldData.data.seller1 = req.body.contactInfo;
    } else {
      fieldData.data.buyer1 = req.body.contactInfo
    }
    data.fieldData = fieldData;
    ```
4. Make the API call:
    ```javascript
    const response = await roomsApi.createRoom(data, process.env.API_ACCOUNT_ID, null);
    ```

## Rooms Page

The **Rooms** page simply returns all of a user&#39;s rooms to them. In the case of this web application, this is all the rooms the user has created using the roomsID stored in his or her local storage. This is done by calling the [GetRooms API](https://developers.docusign.com/docs/rooms-api/reference/Rooms/Rooms/GetRooms) endpoint as shown below.
```javascript
roomsApi.getRooms(process.env.API_ACCOUNT_ID, null, {'officeId': req.session.officeId}, null)
    .then(function (rooms) {
        if (rooms) {
            res.status(200).json(rooms)
        }
    })
  .catch(function (error) {
    if (error) {
        res.status(error.status).send(error.message);
    }
  });
````
## Room Page

The **Room** page allows the user to modify the information about a specific room [UpdateRoomFieldData API](https://developers.docusign.com/docs/rooms-api/reference/rooms/rooms/updateroomfielddata) endpoint as shown below.
```javascript
    let newfieldData = {
      "data": {
        "taxAnnualAmount": 3389.12,
        "buyer1": {
        "name": "Elizabeth Bennet"
      }
    }
    let optsOrCallback = {body: newFieldData}
    roomsApi.updateRoomFieldData(accountId, roomId, optsOrCallback)
        .then(function (newFieldData) {
            res.status(200).json(newFieldData)
        })
      .catch(function (error) {
        if (error) {
            res.status(error.status).send(error.message);
        }
      });
````
## Licenses
This repository uses the MIT License. See the [LICENSE](https://github.com/docusign/sample-app-realestate-nodejs/blob/main/LICENSE) file for more information.
