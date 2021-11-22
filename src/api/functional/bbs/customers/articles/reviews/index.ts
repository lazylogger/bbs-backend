/**
 * @packageDocumentation
 * @module api.functional.bbs.customers.articles.reviews
 */
//================================================================
import { AesPkcs5 } from "./../../../../../__internal/AesPkcs5";
import { Fetcher } from "./../../../../../__internal/Fetcher";
import { Primitive } from "./../../../../../Primitive";
import type { IConnection } from "./../../../../../IConnection";

import type { IBbsReviewArticle } from "./../../../../../structures/bbs/articles/IBbsReviewArticle";
import type { IBbsArticle } from "./../../../../../structures/bbs/articles/IBbsArticle";
import type { IPage } from "./../../../../../structures/common/IPage";


/**
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 * @controller BbsCustomerArticleReviewsController.store()
 * @path POST /bbs/customers/articles/reviews/:code/
 */
export function store
    (
        connection: IConnection,
        code: string,
        input: Primitive<store.Input>
    ): Promise<store.Output>
{
    return Fetcher.fetch
    (
        connection,
        {
            input_encrypted: true,
            output_encrypted: true
        },
        "POST",
        `/bbs/customers/articles/reviews/${code}/`,
        input
    );
}
export namespace store
{
    export type Input = Primitive<IBbsReviewArticle.IStore>;
    export type Output = Primitive<IBbsReviewArticle>;
}

/**
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 * @controller BbsCustomerArticleReviewsController.update()
 * @path PUT /bbs/customers/articles/reviews/:code/:id
 */
export function update
    (
        connection: IConnection,
        code: string,
        id: string,
        input: Primitive<update.Input>
    ): Promise<update.Output>
{
    return Fetcher.fetch
    (
        connection,
        {
            input_encrypted: true,
            output_encrypted: true
        },
        "PUT",
        `/bbs/customers/articles/reviews/${code}/${id}`,
        input
    );
}
export namespace update
{
    export type Input = Primitive<IBbsReviewArticle.IUpdate>;
    export type Output = Primitive<IBbsReviewArticle.IContent>;
}

/**
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 * @controller BbsCustomerArticleReviewsController.index()
 * @path PATCH /bbs/customers/articles/reviews/:code/
 */
export function index
    (
        connection: IConnection,
        code: string,
        input: Primitive<index.Input>
    ): Promise<index.Output>
{
    return Fetcher.fetch
    (
        connection,
        {
            input_encrypted: true,
            output_encrypted: true
        },
        "PATCH",
        `/bbs/customers/articles/reviews/${code}/`,
        input
    );
}
export namespace index
{
    export type Input = Primitive<IBbsArticle.IRequest<IBbsReviewArticle.IRequest.ISearch>>;
    export type Output = Primitive<IPage<IBbsReviewArticle.ISummary>>;
}

/**
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 * @controller BbsCustomerArticleReviewsController.at()
 * @path GET /bbs/customers/articles/reviews/:code/:id
 */
export function at
    (
        connection: IConnection,
        code: string,
        id: string
    ): Promise<at.Output>
{
    return Fetcher.fetch
    (
        connection,
        {
            input_encrypted: false,
            output_encrypted: true
        },
        "GET",
        `/bbs/customers/articles/reviews/${code}/${id}`
    );
}
export namespace at
{
    export type Output = Primitive<IBbsReviewArticle>;
}



//---------------------------------------------------------
// TO PREVENT THE UNUSED VARIABLE ERROR
//---------------------------------------------------------
AesPkcs5;
Fetcher;
Primitive;
