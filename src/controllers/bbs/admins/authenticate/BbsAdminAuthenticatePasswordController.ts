import express from "express";
import * as helper from "encrypted-nestjs";
import * as nest from "@nestjs/common";

import { IBbsAdministrator } from "../../../../api/structures/bbs/actors/IBbsAdministrator";

import { BbsAdministrator } from "../../../../models/tables/bbs/actors/BbsAdministrator";
import { BbsMember } from "../../../../models/tables/bbs/actors/BbsMember";

import { BbsAdminAuth } from "./BbsAdminAuth";
import { BbsMemberProvider } from "../../../../providers/bbs/actors/BbsMemberProvider";

@nest.Controller("bbs/admins/authenticate/password")
export class BbsAdminAuthenticatePasswordController
{
    @nest.Patch("change")
     public async change
        (
            @nest.Request() request: express.Request,
            @helper.EncryptedBody() input: IBbsAdministrator.IAuthorization.IChangePassword
        ): Promise<void>
    {
        const admin: BbsAdministrator = await BbsAdminAuth.authorize(request);
        const member: BbsMember = await admin.base.get();

        await BbsMemberProvider.changePassword(member, input);
    }

    @nest.Patch("reset")
    public async reset
        (
            @helper.EncryptedBody() input: IBbsAdministrator.IAuthorization.IResetPassword
        ): Promise<void>
    {
        await BbsMemberProvider.resetPassword(input);
    }
}