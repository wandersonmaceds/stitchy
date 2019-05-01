import { Connection } from "./Connection";
import { User } from "../model/User";

export class UserDAO{
    private connection: Connection;

    constructor(connection: Connection){
        this.connection = connection;
    }

    async getUsersWithCourses(){
        const query = 'SELECT u.id, u.priority_alert, u.slack_handle, u.name, c.code FROM users u, users_courses uc, courses c WHERE uc.user_id = u.id AND uc.course_id = c.id ORDER BY u.priority_alert, u.id';
        const queryResult = await this.connection.query(query);
        const users = this.transformUsersFromResultQuery(queryResult);

        return this.sortByPriorityAlert(users);
    }

    private sortByPriorityAlert(users: User[]) : User[] {
        return users.sort((u1, u2) => u1.priority_alert - u2.priority_alert);
    }

    private transformUsersFromResultQuery(queryResult) : User[] {
        const users = queryResult.rows.reduce((acc, row) => {
            const user = acc[row.id] ? acc[row.id] : new User(row.id, row.name, row.priority_alert, row.slack_handle);
            user.courses.push(row.code);
            acc[row.id] ? acc[row.id] = user : acc.splice(row.id, 1, user);
            return acc;
        }, []);

        return users;
    }
}
