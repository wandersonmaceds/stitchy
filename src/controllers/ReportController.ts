import { HttpClient } from '../helpers/HttpClient';
import { SlackService } from '../services/SlackService';
import { AluraService } from '../services/AluraService';
import { ConnectionFactory } from '../dao/ConnectionFactory';
import { UserDAO } from '../dao/UserDAO';
import { Connection } from '../dao/Connection';
import { TopicFilters } from '../filters/TopicFilters';
import { MessageBuilder } from '../helpers/MessageBuilder';
import { Controller } from './Controller';
import * as moment from 'moment-timezone';
import { Request, Response } from 'express';

export class ReportController extends Controller {
  
  private httpClient: HttpClient;
  private slackService: SlackService;
  private aluraService: AluraService;
  private connection: Connection;
  private userDao: UserDAO;

  constructor() {
    super('/report'); 
    this.httpClient = new HttpClient();
    this.slackService = new SlackService(this.httpClient);
    this.aluraService = new AluraService(this.httpClient);
    this.connection = new ConnectionFactory().getInstance();
    this.userDao = new UserDAO(this.connection);

    this.router.get('/internal', this.internalSlackAlert.bind(this));
  }

  async internalSlackAlert(request: Request, response: Response) {
    try {
      const datetime = moment().tz('America/Fortaleza');
      const day = datetime.get('day');
      const hour = datetime.get('hours');
      const minutes = request.query.midHour == 'true' ? '30' : '00';
      let scheduledTime = `${hour}:${minutes}`;

      if (request.query.repost) {
        scheduledTime = '09:00:00';
      }

      const users = await this.userDao.getUsersWithCoursesByScheduling(
        day,
        scheduledTime
      );

      if (users.length > 0) {
        let posts = await this.aluraService.getNoAnsweredTopics();
        users.forEach(user => {
          const postsToSend = TopicFilters.filterByCoursesCodesAndLimiter(
            posts,
            user.courses,
            user.limit_items
          );
          posts = posts.filter(post => !postsToSend.includes(post));
          const message = MessageBuilder.forTopicsOnSlack(
            user.name,
            postsToSend
          );
          this.slackService.sendMessage(user.slack_handle, message);
          this.slackService.sendMessage('CJ0DNN86L', `${message}`);
        });
      }
    } catch (e) {
      console.log(e);
    }

    return response.send('enviando tópicos');
  }
}
