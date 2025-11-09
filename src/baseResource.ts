import { XMLBuilder } from "xmlbuilder2/lib/interfaces";

import { Middleware } from "@fenralab/core";
import { Router, Request, Response, declareHandler, VirtualURI  } from "@fenralab/router";

import { PropertyManager } from "./properties";

export abstract class WebDAVResourceBase<
    TRequest extends Request = Request,
    TResponse extends Response = Response,
    TError = any
> extends Router<TRequest, TResponse, TError> {

    propertyManager: PropertyManager<TRequest, TResponse, this>;

    constructor(path?: VirtualURI | string) {
        super(path);

        // this.use(this.WebDAVXMLMiddleware.bind(this))
        this.use(this.setupWebDAVHeadersMiddleware.bind(this));
        
        this.propertyManager = new PropertyManager(this)
    }

    //
    // ------ Middlewares ----------------------------------------------
    //

    async WebDAVXMLMiddleware(request: TRequest, response: TResponse, next: Middleware.TNext): Promise<void> {
        // if (request.headers['content-type']?.includes('xml') && !request.xml){
        //     request.xml = create(convert(await request.body, {format: "object"}))
        // }

        // await next()

        // // More checks needed
        // if (response.xml){
        //     const xml = response.xml.end({prettyPrint: true})

        //     response.setHeader('content-type', 'application/xml; charset="utf-8"')
        //     response.setHeader('content-length', Buffer.byteLength(xml))
        //     response.write(xml)

        //     response.xml = undefined;
        // }
        
    }

    async setupWebDAVHeadersMiddleware(request: TRequest, response: TResponse, next: Middleware.TNext): Promise<void> {

        // request.frames = []

        response.setHeader('DAV', '1')
        response.setHeader('MS-Author-Via', 'DAV')
        response.setHeader('Allow', Array.from(this.handlers.keys()).map(
            it => it.toUpperCase()
        ).join(", ") )
        await next()
    }

    //
    // ------ Methods ----------------------------------------------
    //

    @declareHandler('get')
    async get(request: TRequest, response: TResponse, next: Middleware.TNext): Promise<void> {
        await next();
    }

    @declareHandler('options')
    async options(request: TRequest, response: TResponse, next: Middleware.TNext): Promise<void> {
        await next();
    }

    @declareHandler('head')
    async head(request: TRequest, response: TResponse, next: Middleware.TNext): Promise<void> {
        await next();
    }

    @declareHandler('propfind')
    async propfind(request: TRequest, response: TResponse, next: Middleware.TNext) {
        // response.statusCode = 207; // Multi-Status

        // if (request.xml){
        //     console.log(request.xml.toObject())
        // }

        await next();
        // response.xml = create({ version: '1.0', encoding: 'utf-8' }) 

        // const multistatus = response.xml.ele('D:multistatus', { 'xmlns:D': 'DAV:' })
        // await this.appendResponse(multistatus, request, response)
    }

    @declareHandler('proppatch')
    async proppatch(request: TRequest, response: TResponse, next: Middleware.TNext){
        await next()
    }

    //
    // ------ Properties ----------------------------------------------
    //

    abstract getDisplayName(request: TRequest, response: TResponse) : Promise<string>;
    abstract getContentLength(request: TRequest, response: TResponse) : Promise<number>;
    abstract getResourceType(request: TRequest, response: TResponse) : Promise<string | XMLBuilder>;

    //
    // ------ Details ----------------------------------------------
    //

    // async appendPropertyStatus(builder: XMLBuilder, request: TRequest, response: TResponse) {
    //     // This is where we will determine which properties are request, which can be sent,
    //     // and the respective statuses, grouped into propstats

    //     const propstats = await this.propertyManager.getPropertiesGroupedByStatus(request, response)

    //     for (const [status, properties] of Object.entries(propstats)){

    //         const propstatus = fragment().ele('D:propstat')
    //         propstatus.ele('D:status').txt(status).up()

    //         const props = propstatus.ele('D:prop')
    //         for (const property of properties){
    //             const element = props.ele(property.name);
    //             if (typeof property.content === "string"){
    //                 element.txt(property.content)
    //             } else {
    //                 element.import(property.content)
    //             }
    //         }

    //         builder.import(propstatus)
    //     }
    // }

    // async getFragment(request: TRequest, response: TResponse) {
    //     // console.log(this.path)
    //     return this.path
    // }

    // // Could be moved to router.endpoint class
    // async getAbsoluteUri(request: TRequest, response: TResponse){
    //     return this.fullURI
    // }

    // async getVisibleChildren(request: TRequest, response: TResponse){
    //     return this.children.filter(it => it instanceof WebDAVResourceBase)
    // }

    // async appendResponse(builder: XMLBuilder, request: TRequest, response: TResponse){

    //     // request.frames.push(this)

    //     const responseElement = fragment().ele('D:response')
    //     responseElement.ele('D:href').txt(await this.getAbsoluteUri(request, response))
    //     await this.appendPropertyStatus(responseElement, request, response)
    //     builder.import(responseElement)

    //     const depth = (request.headers['depth'] as '0' | '1' | 'infinity') ?? '0'

    //     if ( ['1', 'infinity'].includes(depth) ){

    //         if (depth == '1'){ request.headers['depth'] = '0' }

    //         for (const child of await this.getVisibleChildren(request, response)){
    //             await child.appendResponse(builder, request, response)
    //         }
    //     }

    //     // request.frames.pop()
    // }
}