import { IBbsMember } from "./IBbsMember";

export type IBbsAdministrator = IBbsMember;
export namespace IBbsAdministrator
{
    export namespace IAuthorization
    {
        export import ILogin = IBbsMember.ILogin;
        export import IChangePassword = IBbsMember.IChangePassword;
        export import IResetPassword = IBbsMember.IResetPassword;
    }
}