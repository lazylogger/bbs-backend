import * as nest from "@nestjs/common";
import safe from "safe-typeorm";
import { AesPkcs5 } from "safe-typeorm";
import { Singleton } from "tstl/thread/Singleton";

import { IBbsMember } from "../../../api/structures/bbs/actors/IBbsMember";

import { BbsMember } from "../../../models/tables/bbs/actors/BbsMember";
import { Citizen } from "../../../models/tables/common/Citizen";

import { CitizenProvider } from "../../common/CitizenProvider";
import { RandomGenerator } from "../../../utils/RandomGenerator";

export namespace BbsMemberProvider
{
    /* ----------------------------------------------------------------
        ACCESSORS
    ---------------------------------------------------------------- */
    export function json(): safe.JsonSelectBuilder<BbsMember, any, IBbsMember>
    {
        return json_builder.get();
    }

    const json_builder = new Singleton(() => BbsMember.createJsonSelectBuilder
    (
        {
            citizen: CitizenProvider.json(),
        }
    ));

    /* ----------------------------------------------------------------
        STORE
    ---------------------------------------------------------------- */
    export async function collect
        (
            collection: safe.InsertCollection, 
            input: IBbsMember.IJoin
        ): Promise<BbsMember>
    {
        const citizen: Citizen = await CitizenProvider.collect(collection, input.citizen);
        const member: BbsMember = BbsMember.initialize({
            id: safe.DEFAULT,
            citizen,
            email: input.email,
            created_at: safe.DEFAULT
        });
        await member.password.set(input.password);
        return collection.push(member);
    }

    export async function changePassword
        (
            BbsMember: BbsMember, 
            input: IBbsMember.IChangePassword
        ): Promise<void>
    {
        if (await BbsMember.password.equals(input.oldbie) === false)
            throw new nest.ForbiddenException("Invalid password.");

        await BbsMember.password.set(input.newbie);
        await BbsMember.update();
    }

    export async function resetPassword(input: IBbsMember.IResetPassword): Promise<void>
    {
        // FIND BbsMember
        const member: BbsMember = await BbsMember
            .createJoinQueryBuilder(BbsMember => BbsMember.innerJoin("citizen"))
            .andWhere(...Citizen.getWhereArguments("mobile", 
                AesPkcs5.encode
                (
                    input.mobile, 
                    Citizen.ENCRYPTION_PASSWORD.key, 
                    Citizen.ENCRYPTION_PASSWORD.iv
                )
            ))
            .getOneOrFail();
        
        // CHANGE PASSWORD
        const password: string = RandomGenerator.alphabets(8);
        await member.password.set(password);
        await member.update();
    }
}