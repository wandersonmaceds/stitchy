import { Connection } from './Connection';
import { User } from '../model/User';

export class UserCourseDAO {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async addCoursesToUsers(usersCoursesFromProfiles: User[]) {
    usersCoursesFromProfiles.forEach(async user => {
      const ids = user.courses.join(',');
      const queryIds = `SELECT id from courses WHERE code IN (${ids})`;
      const coursesIds = await this.connection.query(queryIds);

      const queryUserCoursesIds = `SELECT course_id from users_courses WHERE user_id = ${user.id}`;
      const userCoursesIds = await this.connection.query(queryUserCoursesIds);

      const diffIds = coursesIds.rows.filter(
        c => !userCoursesIds.rows.includes(uci => uci.id == c.id)
      );

      const userIdCourseIdQueryData = diffIds
        .map(c => `(${user.id}, ${c.id})`)
        .join(',');
      const updateCoursesIdsQuery = `INSERT INTO users_courses(user_id, course_id) VALUES ${userIdCourseIdQueryData}`;
      await this.connection.query(updateCoursesIdsQuery);
    });
  }
}
