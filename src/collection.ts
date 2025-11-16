import { XMLBuilder } from "xmlbuilder2/lib/interfaces";
import { fragment } from "xmlbuilder2";

import { Request, Response } from "@fenralab/router";
import * as URI from "@fenralab/url";

import { WebDAVResourceBase } from "./baseResource";

export class WebDAVCollection<
  TRequest extends Request = Request,
  TResponse extends Response = Response,
  TError = any,
> extends WebDAVResourceBase<TRequest, TResponse, TError> {
  constructor(path?: string) {
    super(path);
    // this.maybeImplements('mkcol');
  }

  async getDisplayName(request: TRequest): Promise<string> {
    return URI.toString(this.fullURI, request.params);
  }

  async getContentLength(request: TRequest): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async getResourceType(): Promise<XMLBuilder> {
    return fragment().ele("D:collection");
  }
}
