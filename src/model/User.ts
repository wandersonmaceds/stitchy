export class User{
    readonly id: number;
    readonly slack_handle: string;
    readonly name: string;
    readonly priority_alert: number;
    readonly courses: [];

    constructor(id: number, name: string, priority_alert: number, slack_handle: string = '', courses: [] = []){
        this.id = id;
        this.slack_handle = slack_handle;
        this.name = name;
        this.priority_alert = priority_alert;
        this.courses = courses;
    }
}