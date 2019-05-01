import { Connection } from './Connection';

export class ConnectionFactory{
    private connectionString: string;

    constructor(){
        this.connectionString = process.env.DATABASE_URL
    }

    getInstance() : Connection{
        const connection = new Connection( this.connectionString );
        connection.connect(() => {});
        return connection;
    }
}