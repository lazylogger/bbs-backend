import express from "express";
import * as helper from "encrypted-nestjs";
import * as nest from "@nestjs/common";

import { IBbsSection } from "../../../../api/structures/bbs/systematic/IBbsSection";

import { BbsAdminAuth } from "../authenticate/BbsAdminAuth";
import { BbsSection } from "../../../../models/tables/bbs/systematic/BbsSection";
import { BbsMember } from "../../../../models/tables/bbs/actors/BbsMember";
import { BbsSectionNomination } from "../../../../models/tables/bbs/systematic/BbsSectionNomination";

import { BbsMemberProvider } from "../../../../providers/bbs/actors/BbsMemberProvider";
import { BbsSectionProvider } from "../../../../providers/bbs/systematic/BbsSectionProvider";
import { BbsSectionNominationProvider } from "../../../../providers/bbs/systematic/BbsSectionNominationProvider";

@nest.Controller("bbs/admins/systematic/sections/:code/nominations")
export class BbsAdminSystematicSectionNominationsController
{
    @nest.Get(":id")
    public async store
        (
            @nest.Request() request: express.Request,
            @helper.TypedParam("code", "string") code: string,
            @helper.TypedParam("id", "string") id: string
        ): Promise<IBbsSection.INominatedManager>
    {
        await BbsAdminAuth.authorize(request);

        const section: BbsSection = await BbsSectionProvider.find(code);
        const member: BbsMember = await BbsMember.findOneOrFail(id);
        const nomination: BbsSectionNomination = await BbsSectionNominationProvider.store
        (
            section, 
            member
        );

        return {
            ...await BbsMemberProvider.json().getOne(member),
            nominated_at: nomination.created_at.toString()
        };
    }

    @nest.Delete(":id")
    public async erase
        (
            @nest.Request() request: express.Request,
            @helper.TypedParam("code", "string") code: string,
            @helper.TypedParam("id", "string") id: string
        ): Promise<void>
    {
        await BbsAdminAuth.authorize(request);

        const nomination: BbsSectionNomination = await BbsSectionNomination
            .createJoinQueryBuilder(nomination => nomination.innerJoin("section"))
            .andWhere(...BbsSection.getWhereArguments("code", code))
            .andWhere(...BbsSectionNomination.getWhereArguments("manager", id))
            .getOneOrFail();
        await nomination.remove();
    }
}