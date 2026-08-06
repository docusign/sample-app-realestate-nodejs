require('dotenv').config(); //add env variables
var RoomsNodeSDK = require('docusign-rooms'); //rooms sdk
var axios = require('axios');
var validator = require('validator');
var oAuth = RoomsNodeSDK.ApiClient.OAuth;
var restApi = RoomsNodeSDK.ApiClient.RestApi;
var basePath = (process.env.NODE_ENV === 'dev') ?
    restApi.BasePath.PRODUCTION : restApi.BasePath.DEMO;
var oAuthBasePath = (process.env.NODE_ENV === 'dev') ? 
    oAuth.BasePath.PRODUCTION : oAuth.BasePath.DEMO;
var accountId = process.env.USER_ID;

/*
  This controller method retrieves all of the rooms associated with 
    a particular officeId.
  request body:
    none
  returns:
    status(200): [Rooms]
    status(error.status): error.message 
    //see rooms api docs for detailed error messages 
*/
exports.get_rooms = async (req, res) => {  
    //instantiate and intialize the apiClient
    var roomsNodeSDK = new RoomsNodeSDK.ApiClient({
        basePath: basePath,
        oAuthBasePath: oAuthBasePath
    });    
    //add the jwt to the auth header
    roomsNodeSDK.addDefaultHeader('Authorization', 'Bearer ' + req.session.token);
    //instantiate the RoomApi client from the apiClient
    var roomsApi = new RoomsNodeSDK.RoomsApi(roomsNodeSDK);

    //make the api request, only get rooms associated with an office
    //This example shows how API responses can be handled using .then instead of async await
    roomsApi.getRooms(process.env.API_ACCOUNT_ID, {'officeId': req.session.officeId}, null)
        .then(function (rooms) {
            if (rooms) {
                res.status(200).json(rooms)
            }
        })
      .catch(function (error) {
        if (error) {
            console.log(error);
            res.status(error.status).send(error.message);
        }
      }); 
}

exports.create_room = async (req, res) => {
    console.log('Create Room Api Called');
    var roomsNodeSDK = new RoomsNodeSDK.ApiClient({
        basePath: basePath,
        oAuthBasePath: oAuthBasePath
    });    
    roomsNodeSDK.addDefaultHeader('Authorization', 'Bearer ' + req.session.token);

    //rooms and roles api 
    var roomsApi = new RoomsNodeSDK.RoomsApi(roomsNodeSDK);
    var rolesApi = new RoomsNodeSDK.RolesApi(roomsNodeSDK);

    //The following commented code can be used to view the available countries and states
    //currently suppored by the Rooms API
    //get all the possible Countries
    // try{
    //   let coutriesurl = basePath + '/v2/countries';
    //   let response = await axios.get(coutriesurl, {
    //     headers: {
    //       'Authorization': `Bearer ${req.session.token}`
    //     }
    //   })
    //   console.log(response.data.countries);

    //   let statesurl = basePath + '/v2/states';
    //   let response2 = await axios.get(statesurl, {
    //     headers: {
    //       'Authorization': `Bearer ${req.session.token}`
    //     }
    //   })
    //   console.log(response2.data.states);
    // }
    // catch(error){
    //   console.log(error);
    // }

    //get the role ID for an agent, this could either be hard
    //coded into your application, or you could simply get it 
    //using the rooms API.

    try{
      roleResponse = await rolesApi.getRoles(process.env.API_ACCOUNT_ID);
      agentRoleId = null;
      //Get the agent role. For your application users may have different
      //roles, in this case look for the roleID for the role your user
      //is authenticated for
      for(let i = 0; i < roleResponse.roles.length; i++) {
        if(roleResponse.roles[i].name === 'Agent') {
          agentRoleId = roleResponse.roles[i].roleId;
          break;
        }
      }
      //build the room object
      const data = {}
      data.body = {}
      data.body.name = validator.blacklist(req.body.name, '\\[\\]<>\'\"').trim();
      data.body.roleId = agentRoleId;
      data.body.officeId = req.session.officeId;
      const fieldData = {};
      fieldData.data = {};
      fieldData.data.postalCode = validator.escape(req.body.postalCode).trim();
      fieldData.data.state = validator.escape(req.body.state).trim();
      fieldData.data.city = validator.escape(req.body.city).trim();
      fieldData.data.address1 = validator.escape(req.body.address1).trim();

      //add the lead info
      var contactInfo = {
        email: validator.escape(req.body.contactInfo.email),
        cellPhone: validator.escape(req.body.contactInfo.cellPhone),
        name: validator.escape(req.body.contactInfo.name)
      }

      //add the buyer or seller info
      if(req.body.side ==='sell') {
        data.body.transactionSideId = 'sell';
        fieldData.data.seller1 = contactInfo;
      } else {
        data.body.transactionSideId = 'buy';
        fieldData.data.buyer1 = contactInfo;
      }
      data.body.fieldData = fieldData;
      //send the createroom request
      //here is an example on how you do not have to use the SDK if you do not want
      //too, but instead can just make the API call yourself
      const response = await roomsApi.createRoom(process.env.API_ACCOUNT_ID, data, null); 
      res.status(200).json(response);
    } catch(error){
      console.log(error);
      res.status(error.status).send(error.message);
    }
}

exports.edit_room = async (req, res) => {
  var roomsNodeSDK = new RoomsNodeSDK.ApiClient({
      basePath: basePath,
      oAuthBasePath: oAuthBasePath
  });    
  roomsNodeSDK.addDefaultHeader('Authorization', 'Bearer ' + req.session.token);



  //rooms and roles api 
  var roomsApi = new RoomsNodeSDK.RoomsApi(roomsNodeSDK);

  const fieldData = {};
  fieldData.body = {};
  fieldData.body.data = {};
  //build field data while sanatizing
  for(const key in req.body) {
    //skip empty and null values and sanatize strings
    if(!req.body[key]) continue;
    fieldData.body.data[key] = (typeof req.body[key] === "string") ? validator.escape(req.body[key]) : req.body[key] 
  }
  console.log(fieldData);

  try{
    console.log('Received patch room request');
    console.log(req.body);
    console.log('Params');
    console.log(req.params);
    console.log(fieldData);
    console.log(fieldData);
    const response = await roomsApi.updateRoomFieldData(process.env.API_ACCOUNT_ID, req.params.roomId, fieldData);
    res.status(200).send('Room updated successfully');
  } catch(error) {
    console.log(error);
    res.status(error.status).send(error.message);
  }
}

exports.get_field_data = async (req, res) => {
  var roomsNodeSDK = new RoomsNodeSDK.ApiClient({
    basePath: basePath,
    oAuthBasePath: oAuthBasePath
  });    
  roomsNodeSDK.addDefaultHeader('Authorization', 'Bearer ' + req.session.token);

  var roomsApi = new RoomsNodeSDK.RoomsApi(roomsNodeSDK);

  try{
    const response = await roomsApi.getRoomFieldData(process.env.API_ACCOUNT_ID, req.params.roomId, null);
    res.status(200).json(response.data);
  } catch(error) {
    res.status(400).send('Error getting form data');
  }
}


