const fetch = require("node-fetch");


const API = async function(URL,METHOD,HEADERS,BODY){
   var response =  await fetch(URL ,{
        method : METHOD,
        headers : HEADERS,
        body : BODY

    }).then(resp =>{
        if(METHOD == "DELETE"){
            return resp;
        }
        return resp.json()
    }).then(data =>{
        return data
    })
    return response;
    
}
const buildRequestHandler = async function(url,method,accessToken,body){
    var headers = {
        "Content-Type":"application/json",
        "Authorization" : `Bearer ${accessToken}`

    };
    return API(url,method,headers,body);
}

module.exports = {
    "invokeURL" : buildRequestHandler
}