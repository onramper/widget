/* Copyright ONRAMPER | SAFUDEX B.V. - All Rights Reserved
 * Proprietary and confidential
 * 
 * @url:https://onramper.com
 */

export class CoreError {
    public errorId: number;
    public message: string;

    constructor(id: number, message: any) {
        this.errorId = id;
        this.message = message;
    }
}

export class CoreDatabaseError extends CoreError{
    constructor(databaseName:string, databaseError:object){
        super(1000,`Database "${databaseName}" returned an error while querying for all currencies. DATABASE-ERROR:: "${JSON.stringify(databaseError)}"`);
    }
}

export class CoreRESTServiceError extends CoreError{
    constructor(path?:string,method?:string,message?:object){
        super(1001, `An error was received while calling endpoint #|${path}|# with verb #"${method}"#. ENDPOINT-ERROR:: #"${JSON.stringify(message)}"#`);
    }
}

export class CoreConfigNotFoundError extends CoreError{
    constructor(configFileName:string, message?:object){
        super(1002, `Configuration file named "${configFileName}" cannot not be found. CONFIG-ERROR:: ${JSON.stringify(message)}`);
    }
}