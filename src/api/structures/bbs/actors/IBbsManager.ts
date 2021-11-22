import { IBbsMember } from "./IBbsMember";
import { IBbsSection } from "../systematic/IBbsSection";

export interface IBbsManager 
    extends IBbsManager.IReference
{
    sections: IBbsManager.INominatedSection[];
}

export namespace IBbsManager
{
    export type IReference = IBbsMember;
    export interface INominatedSection extends IBbsSection.IReference
    {
        nominated_at: string;
    }

    export namespace IAuthorization
    {
        export import IJoin = IBbsMember.IJoin;
        export import ILogin = IBbsMember.ILogin;
        export import IChangePassword = IBbsMember.IChangePassword;
        export import IResetPassword = IBbsMember.IResetPassword;
    }
}