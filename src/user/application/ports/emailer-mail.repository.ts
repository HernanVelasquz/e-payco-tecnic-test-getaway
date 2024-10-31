export abstract class SendGridMailRepository {
    abstract sendEmailWithTemplate(email: string, opt: any): Promise<any>;
}