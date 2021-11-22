import * as nest from "@nestjs/common";
import safe from "safe-typeorm";
import { Singleton } from "tstl/thread/Singleton";

import { IBbsAdministrator } from "../../../api/structures/bbs/actors/IBbsAdministrator";

import { BbsAdministrator } from "../../../models/tables/bbs/actors/BbsAdministrator";
import { BbsMember } from "../../../models/tables/bbs/actors/BbsMember";

import { BbsMemberProvider } from "./BbsMemberProvider";

export namespace BbsAdminProvider
{
    /* ----------------------------------------------------------------
        ACCESSORS
    ---------------------------------------------------------------- */
    export function json(): safe.JsonSelectBuilder<BbsAdministrator, any, IBbsAdministrator>
    {
        return json_builder.get();
    }

    const json_builder = new Singleton(() => BbsAdministrator.createJsonSelectBuilder
    (
        { 
            base: BbsMemberProvider.json()
        },
        output => output.base
    ))

    /* ----------------------------------------------------------------
        AUTHORIZATIONS
    ---------------------------------------------------------------- */
    export async function login(input: IBbsAdministrator.IAuthorization.ILogin): Promise<BbsAdministrator>
    {
        const manager: BbsAdministrator | undefined = await BbsAdministrator
            .createJoinQueryBuilder(admin => admin.innerJoinAndSelect("base"))
            .andWhere(...BbsMember.getWhereArguments("email", "=", input.email))
            .getOne();
        if (manager === undefined)
            throw new nest.ForbiddenException("Unable to find the matched account.");

        const member: BbsMember = await manager.base.get();
        if (await member.password.equals(input.password) === false)
            throw new nest.ForbiddenException("Wrong password.");

        return manager;
    }
}