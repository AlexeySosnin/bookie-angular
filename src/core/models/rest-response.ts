
export class RestResponse<T> {
    public code: string;
    public message: string;
    public data: T;

}
export class RestResponseEntity {
    public code: string;
    public msgId: string;
    public text: string;
    public type: string;

}
export class RestResponseUploadEntity {
    public code: string;
    public data: string;
    public msgId: string;
    public text: string;
    public type: string;

}
