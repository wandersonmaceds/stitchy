import { Controller } from './Controller';
import { UserDAO } from '../dao/UserDAO';
import { ConnectionFactory } from '../dao/ConnectionFactory';
import { AluraService } from '../services/AluraService';
import { HttpClient } from '../helpers/HttpClient';
import { UserCourseDAO } from '../dao/UserCourseDAO';
import { SlackService } from '../services/SlackService';
import { Request, Response } from 'express';

export class UserController extends Controller {
  private userDao: UserDAO;
  private aluraService: AluraService;
  private userCoursesDao: UserCourseDAO;
  private slackService: SlackService;

  constructor() {
    super('/user');
    this.router.get(
      '/update-users-courses',
      this.updateUsersCourses.bind(this)
    );
    this.userDao = new UserDAO(new ConnectionFactory().getInstance());
    this.userCoursesDao = new UserCourseDAO(
      new ConnectionFactory().getInstance()
    );
    this.aluraService = new AluraService(new HttpClient());
    this.slackService = new SlackService(new HttpClient());
  }

  async updateUsersCourses(_request: Request, response: Response) {
    try {
      const users = await this.userDao.getUsersWithAutoUpdateCourseList();
      const usersCoursesFromProfiles = await this.aluraService.getCoursesFromProfiles(
        users
      );
      await this.userCoursesDao.addCoursesToUsers(usersCoursesFromProfiles);

      this.slackService.sendMessage(
        'CJ0DNN86L',
        'deu bom atualizando os cursos dos moderadores'
      );
      response.send('deu bom atualizando os cursos dos moderadores');
    } catch (e) {
      console.log(e);
      this.slackService.sendMessage(
        'CJ0DNN86L',
        `deu ruim atualizando os cursos dos moderadores: ${e.message}`
      );
      response.send('deu ruim atualizando os cursos dos moderadores');
    }
  }
}
