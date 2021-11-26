import Api from './Api';
import { Fields } from './form';
import { RequestCallback } from './request';
import ResolvedApi from './ResolvedApi';
import ApiSearchResponse from './ApiSearchResponse';
import SearchForm from './SearchForm';
export default class LazySearchForm {
    id: string;
    fields: Fields;
    api: Api;
    constructor(id: string, api: Api);
    set(key: string, value: any): LazySearchForm;
    ref(ref: string): LazySearchForm;
    query(query: string | string[]): LazySearchForm;
    pageSize(size: number): LazySearchForm;
    graphQuery(query: string): LazySearchForm;
    lang(langCode: string): LazySearchForm;
    page(p: number): LazySearchForm;
    after(documentId: string): LazySearchForm;
    orderings(orderings?: string[]): LazySearchForm;
    url(): Promise<string>;
    submit(cb: RequestCallback<ApiSearchResponse>): Promise<ApiSearchResponse>;
    static toSearchForm(lazyForm: LazySearchForm, api: ResolvedApi): SearchForm;
}
