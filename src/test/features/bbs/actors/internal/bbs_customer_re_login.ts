import { assertType } from "typescript-is";

import api from "../../../../../api";
import { IBbsMember } from "../../../../../api/structures/bbs/actors/IBbsMember";

import { test_bbs_customer_issue } from "../consumers/test_bbs_customer_issue";
import { bbs_customer_logout } from "./bbs_customer_logout";

export async function bbs_customer_re_login
    (
        connection: api.IConnection,
        email: string,
        password: string
    ): Promise<IBbsMember>
{
    bbs_customer_logout(connection);
    await test_bbs_customer_issue(connection);

    const member: IBbsMember = await api.functional.bbs.customers.authenticate.login
    (
        connection,
        {
            email,
            password
        }
    );
    return assertType<typeof member>(member);
}