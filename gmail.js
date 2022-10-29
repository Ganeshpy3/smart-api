const {invokeURL} = require("./invokeURL");
const base64 = require("base-64");
/** 
** Google -> Gmail
** This class supports some gmail api from https://developers.google.com/gmail/api/reference/rest
**/
class Gmail {
    domain = "https://gmail.googleapis.com";
    service = "gmail";
    version = "v1";
    endpoint =`users`;
    /**
     * 
     * @param {string} accessToken Access token
     * @param {string} user Authorised user
     */
    constructor(accessToken,user){
        this.accessToken = accessToken;
        if(user == null){
            this.user="me";
        }
    }
    /**
     */
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
    
    // ************************* Draft ************************* //

    /**
     * 
     * @returns Promise
     */
    async getProfile () {
        return this.invokeUrl(`profile`,"GET");
    }

    // ************************* Draft ************************* //

    // ************************* Draft ************************* //

    /**
     * @param {string} to Recipient address
      * @param {string} subject Subject of the Draft 
      *  @param {string} message message of the Draft
     * @returns   
     *Create a draft message
     */
    async createDraftMessage(to,subject,message){
        var messsage = `To:${to}\nSubject:${subject}\n\n${message}\n`;
        var body = {
                "message":{
                    "raw":base64.encode(messsage)
                }
        }
        return this.invokeUrl(`drafts`,"POST",JSON.stringify(body));
    }

    /**
     * @param {string} id The ID of the draft to retrieve.
     * @returns Promise
     */
    async deleteDraftMessage(id){
        return this.invokeUrl(`drafts/${id}`,"DELETE");
    }

    /**
     * 
     * @param {Number} maxResults Maximum number of drafts to return. This field defaults to 100. The maximum allowed value for this field is 500.
     * @param {string} pageToken  Page token to retrieve a specific page of results in the list.
     * @param {string} q  Only return draft messages matching the specified query. Supports the same query format as the Gmail search box. For example, "from:someuser@example.com rfc822msgid:<somemsgid@example.com> is:unread".
     * @param {boolean} includeSpamTrash Include drafts from SPAM and TRASH in the results.
     * @returns 
     */
    async getDraftMessageList(maxResults,pageToken,q,includeSpamTrash){
        var query="";
        var params = []
        if(maxResults != null){
            query =`maxResults=${maxResults}`;
            params.push(`maxResults=${maxResults}`);
        }
        if(pageToken != null){
            params.push(`pageToken=${pageToken}`);
        }

        if(q!=null){
            params.push(`q=${q}`);
        }
        if(includeSpamTrash != null){
            params.push(`includeSpamTrash=${includeSpamTrash}`);
        }
        params.forEach( (param,index)=>{
            if(index == 0){
                query = param;
            }
            else{
                query += "&"+param
            }
        })
        return this.invokeUrl(`drafts?${query}`,"GET");
    }
    /**
     * 
     * @param {string} id The ID of the draft to retrieve.
     * @param {enum} format The format to return the draft in.
     * @returns {Promise}
     */
    async getDraftMessage(id,format){
        if(format == null || ["full","minimal","raw","metadata"].indexof(format) == -1)
        {
            format = "full";
        }
        return this.invokeUrl(`drafts/${id}?format=${format}`,"GET");
    }
    /**
    * @param {string} id The ID of the draft to retrieve.
    */
    async sendDraftMessage(id){
        const body = {
            "id":id
        };
        return this.invokeUrl(`drafts/send`,"POST",JSON.stringify(body));
    }
    async updateDraftMessage(id,to,subject,message){
        var messsage = `To:${to}\nSubject:${subject}\n\n${message}\n`;
        const body = {
            "message":{
                "raw":base64.encode(messsage)
            }
        }
        return this.invokeUrl(`drafts/${id}`,"PUT",JSON.stringify(body));
    }

    // ************************* Draft ************************* //

    // ************************* Mail ************************* //

    /**
     test
     * */
    async batchDeleteMessages(idList){

    }
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