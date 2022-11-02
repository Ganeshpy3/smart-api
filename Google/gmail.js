const {invokeURL} = require("../invokeURL");
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
     * @constructor
     * @param {string} accessToken Access token
     * @param {string} user Authorised user
     */
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
    
    // ************************* Draft ************************* //

    /**
     * Description
     * @method getProfile
     * Gets the current user's Gmail profile.
     * @returns Promise
     */
    async getProfile () {
        return this.invokeUrl(`profile`,"GET");
    }

    // ************************* Draft ************************* //

    // ************************* Draft ************************* //

    /**
     * Creates a new draft with the DRAFT label
     * @param {string} to Recipient address
     * @param {string} subject Subject of the Draft 
     *  @param {string} message message of the Draft
     * @returns Promise
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
     * Immediately and permanently deletes the specified draft. Does not simply trash it.
     * @param {string} id The ID of the draft to retrieve.
     * @returns Promise
     */
    async deleteDraftMessage(id){
        return this.invokeUrl(`drafts/${id}`,"DELETE");
    }

    /**
     * Lists the drafts in the user's mailbox
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
     * Deletes many messages by message ID. Provides no guarantees that messages were not already deleted or even existed at all.
     * @param {Array.String} idList
     * */
    async batchDeleteMessages(idList){
        const body = {
            "ids":idList
        }
        return this.invokeUrl("messages/batchDelete","POST",JSON.stringify(body));
    }
    /**
     * Modifies the labels on the specified messages.
     * @param {Array.String} idList
     * @param {Array.String} addLabelIds
     * @param {Array.String} removeLabelIds
     */
    async batchModifyMessage(idList,addLabelIds,removeLabelIds){
        const body = {
            "ids" :idList,
            "addLabelIds":addLabelIds,
            "removeLabelIds":removeLabelIds
        }
        return this.invokeUrl("messages/batchModify","POST",JSON.stringify(body));
    }

    /**
     * Lists the messages in the user's mailbox.
     * @param {Number} maxResults
     * @param {String} pageToken
     * @param {String} q
     * @param {Array.String} labelIds
     * @param {boolean} includeSpamTrash
     * @returns 
     */
    async getMessageList(maxResults,pageToken,q,labelIds,includeSpamTrash){
        var query="";
        var params = []
        if(maxResults != null){
            query =`maxResults=${maxResults}`;
            params.push(`maxResults=${maxResults}`);
        }
        if(pageToken != null){
            params.push(`pageToken=${pageToken}`);
        }
        if(labelIds != null){
            params.push(`labelIds=${labelIds}`)
        }
        if(q!=null){
            params.push(`q=${q}`);
        }
        if(includeSpamTrash != null){
            params.push(`includeSpamTrash=${includeSpamTrash}`);
        }
        return this.invokeUrl(`messages?${query}`,"GET");
    }

    /**
     * Gets the specified message.
     * @param {String} id 
     * @returns 
     */
    async getMessageById(id,format){
        if(format == null || ["full","minimal","raw","metadata"].indexof(format) == -1)
        {
            format = "full";
        }
        return this.invokeUrl(`messages/${id}?${format}`,"GET");
    }

    /**
     * Immediately and permanently deletes the specified message. This operation cannot be undone. Prefer messages.trash instead.
     * @param {string} id 
     */
    async deleteMessage(id){
        return this.invokeUrl(`messages/${id}`,"DELETE");
    }

    /**
     * Moves the specified message to the trash.
     * @param {string} id 
     * @returns  Promise
     */
    async trashMessage(id){
        return this.invokeUrl(`messages/${id}/trash`,"POST");
    }

    /**
     * Removes the specified message from the trash.
     * @param {string} id 
     */
    async unTrashMessage(id){
        return this.invokeUrl(`messages/${id}/untrash`,"POST");
    }

    /**
     * 
     * @param {string} to 
     * @param {string} subject 
     * @param {string} message 
     * @returns 
     */
    async sendMessage(to,subject,message){
        var messsage = `To:${to}\nSubject:${subject}\n\n${message}\n`;
        var body = {
                "message":{
                    "raw":base64.encode(messsage)
                }
        }
        return this.invokeUrl(`/messages/send`,"POST",body);
    }
    

    // ************************* Mail ************************* //

    // ************************* Labels ************************* //

    async getLableList(){
        return this.invokeUrl('/labels',"GET");
    }

    async getLabelById(id){
        return this.invokeUrl(`/labels/${id}`,"GET");
    }

    
}

module.exports ={
    "gmail" : Gmail
}