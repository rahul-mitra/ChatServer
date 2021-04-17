export class Message {
    user: User;
    message: string;
    hasAttachment: boolean;
    attachment: File;
    constructor(user: User, message: string, hasAttachment: boolean = false, attachment: File = null) {
        this.user = user; this.message = message; this.hasAttachment = hasAttachment; this.attachment = attachment;
    }
}



export class User {
    userName: string;

    constructor(userName: string) {
        this.userName = userName;
    }
}