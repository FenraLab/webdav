import { XMLBuilder } from "xmlbuilder2/lib/interfaces";
import { fragment } from "xmlbuilder2";

import { WebDAVResourceBase } from "./baseResource";
import { Request, Response } from "@fenralab/router";

export class WebDAVCollection<
  TRequest extends Request = Request,
  TResponse extends Response = Response,
  TError = any,
> extends WebDAVResourceBase<TRequest, TResponse, TError> {
  constructor(path?: string) {
    super(path);
    // this.maybeImplements('mkcol');
  }

  async getDisplayName(
    request: TRequest,
    response: TResponse,
  ): Promise<string> {
    throw new Error("Method not implemented.");
  }
  async getContentLength(
    request: TRequest,
    response: TResponse,
  ): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async getResourceType(): Promise<string | XMLBuilder> {
    return fragment().ele("D:collection");
  }
}
