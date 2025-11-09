
import { Request, Response, VirtualURI } from "@fenralab/router";

import { WebDAVResourceBase } from "./baseResource";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";

export class WebDAVResource<
    TRequest extends Request = Request,
    TResponse extends Response = Response,
    TError = any
> extends WebDAVResourceBase<TRequest, TResponse, TError> {

    async getDisplayName(request: TRequest, response: TResponse): Promise<string> {
        throw new Error("Method not implemented.");
    }
    async getContentLength(request: TRequest, response: TResponse): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async getResourceType(request: TRequest, response: TResponse): Promise<string | XMLBuilder> {
        throw new Error("Method not implemented.");
    }

    constructor(path?: VirtualURI | string) {
        super(path);
    }

}
