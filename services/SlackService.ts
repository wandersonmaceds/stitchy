import { HttpClient } from "../helpers/HttpClient";

class SlackService {
    
    private httpClient : HttpClient;
    private slackToken : string;
    private slackPostMessageURI: string;

    constructor(httpClient : HttpClient){
        this.httpClient = httpClient;
        this.slackToken = process.env.SLACK_TOKEN;
        this.slackPostMessageURI = process.env.SLACK_POST_MESSAGE_API;
    }

    sendMessage(channel, message) : void {
        this.httpClient.get(this.slackPostMessageURI, {
            params: {
                token: this.slackToken,
                channel: channel,
                text: message,
                username: process.env.APP_NAME,
                icon_url: process.env.APP_ICON_URL
            }
        })
        .then(() => {})
        .catch(error => console.error('Error while sending message to slack: ', error));
    }
    
}