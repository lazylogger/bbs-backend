import * as nest from "@nestjs/common";
import safe from "safe-typeorm";
import { Singleton } from "tstl/thread/Singleton";

import { IBbsCustomer } from "../../../api/structures/bbs/actors/IBbsCustomer";
import { ICitizen } from "../../../api/structures/common/ICitizen";

import { BbsCustomer } from "../../../models/tables/bbs/actors/BbsCustomer";
import { BbsMember } from "../../../models/tables/bbs/actors/BbsMember";
import { Citizen } from "../../../models/tables/common/Citizen";

import { BbsMemberProvider } from "./BbsMemberProvider";
import { CitizenProvider } from "../../common/CitizenProvider";

export namespace BbsCustomerProvider
{
    /* ----------------------------------------------------------------
        ACCECSSORS
    ---------------------------------------------------------------- */
    export function json<Ensure extends boolean>
        (): safe.JsonSelectBuilder<BbsCustomer<Ensure>, any, IBbsCustomer>
    {
        return json_builder.get();
    }

    const json_builder = new Singleton(() => BbsCustomer.createJsonSelectBuilder
    (
        {
            citizen: CitizenProvider.json(),
            member: BbsMemberProvider.json(),
        }
    ));

    /* ----------------------------------------------------------------
        AUTHORIZATIONS
    ---------------------------------------------------------------- */
    export async function issue
        (
            input: IBbsCustomer.IStore, 
            ip: string
        ): Promise<BbsCustomer>
    {
        const customer: BbsCustomer = BbsCustomer.initialize({
            id: safe.DEFAULT,
            citizen: null as any,
            member: null,
            href: input.href,
            referrer: input.referrer,
            ip,
            created_at: safe.DEFAULT
        });
        return await customer.save();
    }

    export async function activate
        (
            customer: BbsCustomer,
            input: ICitizen.IStore
        ): Promise<Citizen>
    {
        if (customer.member.id !== null)
            throw new nest.UnprocessableEntityException("You've already activated as a member.");
        else if (customer.citizen.id !== null)
            throw new nest.UnprocessableEntityException("You've already activated as a citizen.");

        const collection: safe.InsertCollection = new safe.InsertCollection();
        const citizen: Citizen = await CitizenProvider.collect(collection, input);
        await customer.citizen.set(citizen);

        collection.after(() => customer.update());
        await collection.execute();

        return citizen;
    }
    
    export async function join
        (
            customer: BbsCustomer,
            input: IBbsCustomer.IAuthorization.IJoin
        ): Promise<BbsMember>
    {
        // HAVE ACTIVATED?
        if (customer.member.id !== null)
            throw new nest.ForbiddenException("You've already joined as a member.");
        else if (customer.citizen.id !== null)
        {
            const citizen: Citizen = (await customer.citizen.get())!;
            if (citizen.name !== input.citizen.name || citizen.mobile !== input.citizen.mobile)
                throw new nest.ForbiddenException("You've already activated as a different citizen.")
        }

        // COLLECT INSERTION
        const collection: safe.InsertCollection = new safe.InsertCollection();
        const member: BbsMember = await BbsMemberProvider.collect(collection, input);
        collection.after(() => assign(customer, member));

        // DO INSERT
        await collection.execute();
        return member;
    }

    export async function login
        (
            customer: BbsCustomer,
            input: IBbsCustomer.IAuthorization.ILogin
        ): Promise<BbsMember>
    {
        if (customer.member.id !== null)
            throw new nest.ForbiddenException("You've already logged-in as a member.");

        // FIND MATCHED MEMBER
        const member: BbsMember | undefined = await BbsMember
            .createQueryBuilder()
            .andWhere(...BbsMember.getWhereArguments("email", input.email))
            .getOne();
        if (member === undefined)
            throw new nest.ForbiddenException("Unable to find the matched email.");
        else if (await member.password.equals(input.password) === false)
            throw new nest.ForbiddenException("Wrong password.");
        
        // COMPARE CITIZEN
        if (customer.member.id === null && customer.citizen.id !== null)
        {
            const oldbie: Citizen = (await customer.citizen.get())!;
            const newbie: Citizen = await member.citizen.get();

            if (oldbie.mobile !== newbie.mobile || oldbie.name !== newbie.name)
                throw new nest.ForbiddenException("You've already activated as a different citizen.");
        }

        // RETURNS WITH ASSIGNMENT
        await assign(customer, member);
        return member;
    }

    async function assign
        (
            customer: BbsCustomer, 
            member: BbsMember
        ): Promise<void>
    {
        await customer.member.set(member);
        await customer.citizen.set(await member.citizen.get());
        await customer.update();
    }
}