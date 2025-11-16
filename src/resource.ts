import * as URI from "@fenralab/url";
import { Request, Response, VirtualURI } from "@fenralab/router";

import { WebDAVResourceBase } from "./baseResource";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";

export class WebDAVResource<
  TRequest extends Request = Request,
  TResponse extends Response = Response,
  TError = any,
> extends WebDAVResourceBase<TRequest, TResponse, TError> {
  async getDisplayName(request: TRequest): Promise<string> {
    return URI.toString(this.fullURI, request.params);
  }
  async getContentLength(request: TRequest): Promise<number> {
    throw new Error("Method not implemented.");
  }
  async getResourceType(request: TRequest): Promise<string | XMLBuilder> {
    throw new Error("Method not implemented.");
  }

  constructor(path?: VirtualURI | string) {
    super(path);
  }
}
