import { HttpClient } from "../helpers/HttpClient";
import { SlackService } from "../services/SlackService";
import { AluraService } from "../services/AluraService";
import { ConnectionFactory } from "../dao/ConnectionFactory";
import { UserDAO } from "../dao/UserDAO";
import { Connection } from "../dao/Connection";
import { TopicFilters } from "../filters/TopicFilters";
import { MessageBuilder } from "../helpers/MessageBuilder";

export class ReportController{
    
    private router: any;
    private httpClient: HttpClient;
    private slackService: SlackService;
    private aluraService: AluraService;
    private connection: Connection;
    private userDao: UserDAO;

    constructor(router){
        this.router = router;
        this.httpClient = new HttpClient();
        this.slackService = new SlackService(this.httpClient);
        this.aluraService = new AluraService(this.httpClient);
        this.connection = new ConnectionFactory().getInstance();
        this.userDao = new UserDAO(this.connection);
        
        this.router.get('/internal', this.internalSlackAlert.bind(this));
    }

    async internalSlackAlert(request, response){
        try{
            
            let posts = await this.aluraService.getNoAnsweredTopics();
            const users = await this.userDao.getUsersWithCourses();
            users.forEach(user => {
                const postsToSend = TopicFilters.filterByCoursesCodesAndLimiter(posts, user.courses, 10);
                posts = posts.filter(post => !postsToSend.includes(post));
                const message = MessageBuilder.forTopicsOnSlack(user.name, postsToSend);
                //slackService.sendMessage(user.slack_handle, message);
                this.slackService.sendMessage('CJ0DNN86L', `${message}`);
            });

        } catch(e) {
            console.log(e);    
        }
        
        response.send('enviando tópicos');
    }

    getRoutes(){
        return this.router;
    }

}