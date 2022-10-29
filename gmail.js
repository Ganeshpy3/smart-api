const {invokeURL} = require("./invokeURL");
const base64 = require("base-64");
class Gmail {
    domain = "https://gmail.googleapis.com";
    service = "gmail";
    version = "v1";
    endpoint =`users`;
    constructor(accessToken,user){
        this.accessToken = accessToken;
        if(user == null){
            this.user="me";
        }
    }
    async invokeUrl(url,method,body){
        url =  `${this.baseUrl()}/${url}`;
        var response = await invokeURL(encodeURI(url),method,this.accessToken,body).then(data=>{
            return data;
        });
        return response;
        
    }
    baseUrl (){
        return `${this.domain}/${this.service}/${this.version}/${this.endpoint}/${this.user}`;
    }
    async getProfile () {
        return this.invokeUrl(`profile`,"GET");
    }
    // ************************* Draft ************************* //

    async createDraftMessage(to,subject,message){
        var messsage = `To:${to}\nSubject:${subject}\n\n${message}\n`;
        var body = {
                "message":{
                    "raw":base64.encode(messsage)
                }
        }
        return this.invokeUrl(`drafts`,"POST",JSON.stringify(body));
    }

    async deleteDraftMessage(id){
        return this.invokeUrl(`drafts/${id}`,"DELETE");
    }

    async getDraftMessageList(maxResults,pageToken,q,includeSpamTrash){
        var query="";
        // if(maxResults != null){
        //     query +""
        // }
        return this.invokeUrl(`drafts`,"GET");
    }

    async getDraftMessage(id,format){
        if(format == null || ["full","minimal","raw","metadata"].indexof(format) == -1)
        {
            format = "full";
        }
        return this.invokeUrl(`drafts/${id}?format=${format}`,"GET");
    }

    // ************************* Draft ************************* //

    // ************************* Mail ************************* //

    async getMessageList(){
        return this.invokeUrl(`messages`,"GET");
    }
    async  getMessageById(id){
        return this.invokeUrl(`messages/${id}`,"GET");
    }

    // ************************* Mail ************************* //
    
}


module.exports ={
    "gmail" : Gmail
}