class SlackService{

    constructor(httpClient){
        this._httpClient = httpClient;
        this._slackTokenAPI = process.env.SLACK_TOKEN;
    }

    sendMessage(dest, message){
        this._httpClient.get('https://slack.com/api/chat.postMessage', {
            params: {
                token: this._slackTokenAPI,
                channel: user,
                text: message,
                username: 'Stitch',
                icon_url: 'https://i.imgur.com/2WOJif0.png'
            }
        })
        .then(() => {})
        .catch(error => console.error(error));
    }
    
}