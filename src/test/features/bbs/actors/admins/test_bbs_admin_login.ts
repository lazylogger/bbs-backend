import safe from "safe-typeorm";
import { Singleton } from "tstl/thread/Singleton";
import { assertType } from "typescript-is";

import api from "../../../../../api";
import { IBbsAdministrator } from "../../../../../api/structures/bbs/actors/IBbsAdministrator";

import { BbsAdministrator } from "../../../../../models/tables/bbs/actors/BbsAdministrator";
import { BbsMember } from "../../../../../models/tables/bbs/actors/BbsMember";

import { BbsMemberProvider } from "../../../../../providers/bbs/actors/BbsMemberProvider";
import { Configuration } from "../../../../../Configuration";

const EMAIL = "robot-admin@samchon.org";

const singleton: Singleton<Promise<IBbsAdministrator>> = new Singleton(async () =>
{
    let admin: BbsAdministrator | undefined = await BbsAdministrator
        .createJoinQueryBuilder(admin => admin.innerJoinAndSelect("base"))
        .andWhere(...BbsMember.getWhereArguments("email", EMAIL))
        .getOne();
    if (admin === undefined)
    {
        const collection: safe.InsertCollection = new safe.InsertCollection();
        const base: BbsMember = await BbsMemberProvider.collect
        (
            collection,
            {
                email: EMAIL,
                citizen: {
                    name: "로보트_관리자",
                    mobile: "000-0000-0000"
                },
                password: Configuration.SYSTEM_PASSWORD
            }
        );
        admin = collection.push(BbsAdministrator.initialize({ base }));
        await collection.execute();
    }
    return await BbsMemberProvider.json().getOne(await admin.base.get());
});

export async function test_api_bbs_admin_login(connection: api.IConnection): Promise<IBbsAdministrator>
{
    await singleton.get();
    const admin: IBbsAdministrator = await api.functional.bbs.admins.authenticate.login
    (
        connection, 
        {
            email: EMAIL,
            password: Configuration.SYSTEM_PASSWORD
        }
    );
    return assertType<typeof admin>(admin);
}