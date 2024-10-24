export class ResponseBuildingModel<T> {
    public succeeded: boolean;
    public result?: T;
    public error?: ErrorMessageBuildingModel;
}

export class ErrorMessageBuildingModel {
    public code: string;
    public error: string;
    public title: string;
}