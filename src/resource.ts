import { XMLBuilder } from "xmlbuilder2/lib/interfaces";
import { fragment } from "xmlbuilder2";

import * as URI from "@fenralab/url";
import { Request, Response, VirtualURI } from "@fenralab/router";

import { WebDAVResourceBase } from "./baseResource";
import { PropertyManager } from "./properties";

export class WebDAVResourcePropertyManager<
  TRequest extends Request = Request,
  TResponse extends Response = Response,
  TResource extends WebDAVResource<TRequest, TResponse> = WebDAVResource<
    TRequest,
    TResponse
  >,
> extends PropertyManager<TRequest, TResponse, TResource> {
  constructor(resource: TResource) {
    super(resource);
  }
}

export class WebDAVResource<
  TRequest extends Request = Request,
  TResponse extends Response = Response,
  TError = any,
> extends WebDAVResourceBase<TRequest, TResponse, TError> {
  override createPropertyManager(): typeof this.propertyManager {
    return new WebDAVResourcePropertyManager<TRequest, TResponse, this>(this);
  }

  async getDisplayName(request: TRequest): Promise<string> {
    return URI.toString(this.fullURI, request.params);
  }

  async getContentLength(request: TRequest): Promise<number> {
    throw new Error("Method not implemented.");
  }

  async getResourceType(request: TRequest): Promise<undefined | XMLBuilder> {
    return fragment();
  }

  constructor(path?: VirtualURI | string) {
    super(path);
  }
}
