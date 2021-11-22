import express from "express";
import * as helper from "encrypted-nestjs";
import * as nest from "@nestjs/common";
import { IPointer } from "tstl/functional/IPointer";
import { assertType } from "typescript-is";

import { IBbsCustomer } from "../../../../api/structures/bbs/actors/IBbsCustomer";
import { IBbsMember } from "../../../../api/structures/bbs/actors/IBbsMember";
import { ICitizen } from "../../../../api/structures/common/ICitizen";

import { BbsCustomer } from "../../../../models/tables/bbs/actors/BbsCustomer";
import { Citizen } from "../../../../models/tables/common/Citizen";
import { BbsMember } from "../../../../models/tables/bbs/actors/BbsMember";

import { BbsCustomerAuth } from "./BbsCustomerAuth";
import { BbsCustomerProvider } from "../../../../providers/bbs/actors/BbsCustomerProvider";
import { BbsMemberProvider } from "../../../../providers/bbs/actors/BbsMemberProvider";
import { CitizenProvider } from "../../../../providers/common/CitizenProvider";

@nest.Controller("bbs/customers/authenticate")
export class BbsCustomerAuthenticateController
{
    @helper.EncryptedRoute.Get()
    public async get
        (
            @nest.Request() request: express.Request
        ): Promise<IBbsCustomer>
    {
        const { customer } = await BbsCustomerAuth.authorize(request, false, false);
        return await BbsCustomerProvider.json().getOne(customer);
    }

    @helper.EncryptedRoute.Patch("issue")
    public async issue
        (
            @nest.Request() request: express.Request,
            @helper.EncryptedBody() input: IBbsCustomer.IStore
        ): Promise<IBbsCustomer>
    {
        assertType<typeof input>(input);

        const customer: BbsCustomer = await BbsCustomerProvider.issue(input, request.ip);

        return {
            ...await BbsCustomerProvider.json().getOne(customer),
            ...BbsCustomerAuth.issue(customer, true)
        };
    }

    @helper.EncryptedRoute.Post("activate")
    public async activate
        (
            @nest.Request() request: express.Request, 
            @helper.EncryptedBody() input: ICitizen.IStore
        ): Promise<ICitizen>
    {
        assertType<typeof input>(input);

        const { customer } = await BbsCustomerAuth.authorize(request, false, true);
        const citizen: Citizen = await BbsCustomerProvider.activate(customer, input);

        return await CitizenProvider.json().getOne(citizen);
    }

    @helper.EncryptedRoute.Get("refresh")
    public async refresh
        (
            @nest.Request() request: express.Request
        ): Promise<object>
    {
        const ptr: IPointer<boolean> = { value: false };
        const { customer } = await BbsCustomerAuth.authorize(request, false, true);
        
        return BbsCustomerAuth.issue(customer, ptr.value);
    }

    @helper.EncryptedRoute.Post("join")
    public async join
        (
            @nest.Request() request: express.Request,
            @helper.EncryptedBody() input: IBbsCustomer.IAuthorization.IJoin
        ): Promise<IBbsMember>
    {
        assertType<typeof input>(input);

        const { customer } = await BbsCustomerAuth.authorize(request, false, true);
        const member: BbsMember = await BbsCustomerProvider.join(customer, input);

        return await BbsMemberProvider.json().getOne(member);
    }

    @helper.EncryptedRoute.Post("login")
    public async login
        (
            @nest.Request() request: express.Request,
            @helper.EncryptedBody() input: IBbsCustomer.IAuthorization.ILogin
        ): Promise<IBbsMember>
    {
        assertType<typeof input>(input);

        const { customer } = await BbsCustomerAuth.authorize(request, false, true);
        const member: BbsMember = await BbsCustomerProvider.login(customer, input);

        return await BbsMemberProvider.json().getOne(member);
    }
}