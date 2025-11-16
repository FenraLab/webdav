import type { XMLBuilder } from "xmlbuilder2/lib/interfaces";

import {
  Endpoint,
  EVisitResult,
  Request,
  Response,
  Router,
  RouterVisitor,
} from "@fenralab/router";

import { WebDAVResourceBase } from "./baseResource";
import { fragment } from "xmlbuilder2";

export interface IPropFindProperty {
  value: XMLBuilder;
}

export interface IPropFindPropStat {
  properties: IPropFindProperty[];
  status: string;
}

export interface IPropFindResponse {
  href: string;
  propstat: IPropFindPropStat[];
}

export interface WebDAVResourcePropertySupport<
  TRequest extends Request = Request,
  TResponse extends Response = Response,
  TError = any,
  TPropertyManager extends PropertyManager<
    TRequest,
    TResponse,
    WebDAVResourceBase<TRequest, TResponse, TError>
  > = PropertyManager<
    TRequest,
    TResponse,
    WebDAVResourceBase<TRequest, TResponse, TError>
  >,
> {
  propertyManager?: TPropertyManager;
  createPropertyManager(): TPropertyManager;
}

function hasPropertySupport(obj: any): obj is WebDAVResourcePropertySupport {
  return "propertyManager" in obj && "createPropertyManager" in obj;
}

export class WebDAVResourcePropertyManagerVisitor<
  TRequest extends Request = Request,
  TResponse extends Response = Response,
  TEndpoint extends Endpoint<TRequest, TResponse> = Endpoint<
    TRequest,
    TResponse
  >,
> extends RouterVisitor<TRequest, TResponse, TEndpoint> {
  public responses?: IPropFindResponse[];

  constructor(
    public depth: "0" | "1" | "infinity",
    public request: TRequest,
  ) {
    super();
  }

  override traverse(endpoint: TEndpoint): Promise<EVisitResult> {
    this.responses = [];
    return super.traverse(endpoint);
  }

  protected async visit(endpoint: TEndpoint): Promise<EVisitResult> {
    if (hasPropertySupport(endpoint)) {
      const responses =
        (await endpoint.propertyManager?.getPropFindResponses(this.request)) ??
        [];
      this.responses?.push(...responses);
      console.log(responses);

      if (this.depth == "infinity") {
        // Maybe disallow this behaviour
        return EVisitResult.Recurse;
      }

      if (this.stack.length < 1 && this.depth == "1") {
        return EVisitResult.Recurse;
      }
    }
    return EVisitResult.Continue;
  }

  protected override async getChildren(endpoint: Router): Promise<TEndpoint[]> {
    return endpoint.children.filter(
      hasPropertySupport,
    ) as unknown as TEndpoint[];
  }
}

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

  async getPropFindResponses(request: TRequest): Promise<IPropFindResponse[]> {
    return [
      {
        href: "HREF",
        propstat: [
          {
            properties: [
              {
                value: fragment()
                  .ele("D:displayname")
                  .txt(await this.resource.getDisplayName(request)),
              },
            ],
            status: "HTTP/1.1 200 OK",
          },
        ],
      },
    ];
  }

  // async getPropertiesGroupedByStatus(
  //   request: TRequest,
  //   response: TResponse,
  // ): Promise<Record<string, Property[]>> {
  //   return {
  //     ["HTTP/1.1 200 OK"]: [
  //       new Property(
  //         "D:displayname",
  //         await this.resource.getDisplayName(request),
  //       ),
  //       new Property(
  //         "D:resourcetype",
  //         await this.resource.getResourceType(request),
  //       ),
  //       new Property(
  //         "D:getcontentlength",
  //         (await this.resource.getContentLength(request)).toString(),
  //       ),
  //       new Property("D:getlastmodified", "Mon, 01 Nov 2025 17:00:00 GMT"),
  //       new Property("D:creationdate", "Mon, 01 Nov 2025 17:00:00 GMT"),
  //       new Property("D:read-only", ""),
  //     ],
  //   };
  // }
}
