import { Request, Response } from "express";
import { Controller } from "./Controller";

export class AppController extends Controller{

    constructor() {
        super('/');
        this.router.get('/', this.home.bind(this));
    }

    home(_request: Request, response: Response) {
        return response.send('App running!');
    }
}