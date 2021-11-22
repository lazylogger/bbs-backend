import express from "express";
import * as helper from "encrypted-nestjs";
import * as nest from "@nestjs/common";

import { IBbsManager } from "../../../../api/structures/bbs/actors/IBbsManager";

import { BbsManager } from "../../../../models/tables/bbs/actors/BbsManager";
import { BbsMember } from "../../../../models/tables/bbs/actors/BbsMember";

import { BbsManagerAuth } from "./BbsManagerAuth";
import { BbsMemberProvider } from "../../../../providers/bbs/actors/BbsMemberProvider";

@nest.Controller("bbs/managers/authenticate/password")
export class BbsManagerAuthenticatePasswordController
{
    @nest.Patch("change")
     public async change
        (
            @nest.Request() request: express.Request,
            @helper.EncryptedBody() input: IBbsManager.IAuthorization.IChangePassword
        ): Promise<void>
    {
        const manager: BbsManager = await BbsManagerAuth.authorize(request, true);
        const base: BbsMember = await manager.base.get();

        await BbsMemberProvider.changePassword(base, input);
    }

    @nest.Patch("reset")
    public async reset
        (
            @helper.EncryptedBody() input: IBbsManager.IAuthorization.IResetPassword
        ): Promise<void>
    {
        await BbsMemberProvider.resetPassword(input);        
    }
}