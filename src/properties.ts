import { XMLBuilder } from "xmlbuilder2/lib/interfaces";
import { Request, Response } from "@fenralab/router";

import { WebDAVResourceBase } from "./baseResource";

export class Property {
  constructor(
    public name: string,
    public content: string | XMLBuilder,
  ) {}
}

export class PropertyManager<
  TRequest extends Request = Request,
  TResponse extends Response = Response,
  TResource extends WebDAVResourceBase<
    TRequest,
    TResponse
  > = WebDAVResourceBase<TRequest, TResponse>,
> {
  constructor(public resource: TResource) {}

  async getPropertiesGroupedByStatus(
    request: TRequest,
    response: TResponse,
  ): Promise<Record<string, Property[]>> {
    return {
      ["HTTP/1.1 200 OK"]: [
        new Property(
          "D:displayname",
          await this.resource.getDisplayName(request, response),
        ),
        new Property(
          "D:resourcetype",
          await this.resource.getResourceType(request, response),
        ),
        new Property(
          "D:getcontentlength",
          (await this.resource.getContentLength(request, response)).toString(),
        ),
        new Property("D:getlastmodified", "Mon, 01 Nov 2025 17:00:00 GMT"),
        new Property("D:creationdate", "Mon, 01 Nov 2025 17:00:00 GMT"),
        new Property("D:read-only", ""),
      ],
    };
  }
}
