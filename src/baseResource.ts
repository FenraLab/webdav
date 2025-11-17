import { create } from "xmlbuilder2";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";

import { Middleware } from "@fenralab/core";
import {
  Router,
  Request,
  Response,
  declareHandler,
  VirtualURI,
} from "@fenralab/router";

import {
  PropertyManager,
  WebDAVResourcePropertyManagerVisitor,
  WebDAVResourcePropertySupport,
} from "./properties";

export abstract class WebDAVResourceBase<
    TRequest extends Request = Request,
    TResponse extends Response = Response,
    TError = any,
  >
  extends Router<TRequest, TResponse, TError>
  implements WebDAVResourcePropertySupport<TRequest, TResponse, TError>
{
  propertyManager: PropertyManager<
    TRequest,
    TResponse,
    WebDAVResourceBase<TRequest, TResponse, TError>
  >;

  constructor(path?: VirtualURI | string) {
    super(path);

    this.use(this.setupWebDAVHeadersMiddleware.bind(this));

    this.propertyManager = this.createPropertyManager();
  }

  createPropertyManager(): typeof this.propertyManager {
    return new PropertyManager(this);
  }

  //
  // ------ Middlewares ----------------------------------------------
  //

  async setupWebDAVHeadersMiddleware(
    request: TRequest,
    response: TResponse,
    next: Middleware.TNext,
  ): Promise<void> {
    // request.frames = []

    response.setHeader("DAV", "1");
    response.setHeader("MS-Author-Via", "DAV");
    response.setHeader(
      "Allow",
      Array.from(this.handlers.keys())
        .map((it) => it.toUpperCase())
        .join(", "),
    );
    await next();
  }

  //
  // ------ Methods ----------------------------------------------
  //

  @declareHandler("get")
  async get(
    request: TRequest,
    response: TResponse,
    next: Middleware.TNext,
  ): Promise<void> {
    await next();
  }

  @declareHandler("options")
  async options(
    request: TRequest,
    response: TResponse,
    next: Middleware.TNext,
  ): Promise<void> {
    await next();
  }

  @declareHandler("head")
  async head(
    request: TRequest,
    response: TResponse,
    next: Middleware.TNext,
  ): Promise<void> {
    await next();
  }

  @declareHandler("propfind")
  async propfind(
    request: TRequest,
    response: TResponse,
    next: Middleware.TNext,
  ) {
    response.statusCode = 207; // Multi-Status

    const depth = (request.headers["depth"] ?? "0") as "0" | "1" | "infinity";

    const traversalAgent = new WebDAVResourcePropertyManagerVisitor<
      TRequest,
      TResponse,
      this
    >(depth, request);
    await traversalAgent.traverse(this);

    await next();
    const xml = create({ version: "1.0", encoding: "utf-8" });
    const multistatus = xml.ele("D:multistatus", { "xmlns:D": "DAV:" });

    for (const response of traversalAgent.responses ?? []) {
      const responseXML = multistatus.ele("D:response");
      responseXML.ele("D:href").txt(response.href);

      for (const propstat of response.propstat) {
        const propstatXML = responseXML.ele("D:propstat");
        propstatXML.ele("D:status").txt(propstat.status);
        const propXML = propstatXML.ele("D:prop");

        for (const property of propstat.properties) {
          // console.log(property);
          propXML.import(property.value);
        }
      }
    }
    response.write(xml.toString({ prettyPrint: true }));
  }

  @declareHandler("proppatch")
  async proppatch(
    request: TRequest,
    response: TResponse,
    next: Middleware.TNext,
  ) {
    await next();
  }

  //
  // ------ Properties ----------------------------------------------
  //

  abstract getDisplayName(request: TRequest): Promise<string>;

  abstract getContentLength(request: TRequest): Promise<number>;

  abstract getResourceType(request: TRequest): Promise<undefined | XMLBuilder>;

  //
  // ------ Details ----------------------------------------------
  //
}
