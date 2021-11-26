import HttpClient from './HttpClient';
import { RequestCallback } from './request';
export declare type Fields = {
    [key: string]: any;
};
export interface FormData {
    fields: Fields;
    action: string;
    name: string;
    rel: string;
    form_method: string;
    enctype: string;
}
export declare abstract class Form {
    httpClient: HttpClient;
    form: FormData;
    data: any;
    constructor(form: FormData, httpClient: HttpClient);
    protected set(field: string, value: any): void;
    url(): string;
    /**
     * Submits the query, and calls the callback function.
     */
    submit<T>(cb?: RequestCallback<T>): Promise<T>;
}
