import { ICitizen } from "../../common/ICitizen";
import { IBbsMember } from "./IBbsMember";

export interface IBbsCustomer
{
    id: string;
    ip: string;
    citizen: ICitizen | null;
    member: IBbsMember | null;
    href: string;
    referrer: string;
    created_at: string;
}

export namespace IBbsCustomer
{
    export interface IStore
    {
        href: string;
        referrer: string;
    }

    export namespace IAuthorization
    {
        export import IJoin = IBbsMember.IJoin;
        export import ILogin = IBbsMember.ILogin;
        export import IChangePassword = IBbsMember.IChangePassword;
        export import IResetPassword = IBbsMember.IResetPassword;
    }
}