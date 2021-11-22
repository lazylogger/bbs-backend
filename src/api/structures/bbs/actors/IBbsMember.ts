import { ICitizen } from "../../common/ICitizen";

export interface IBbsMember
{
    id: string;
    email: string;
    citizen: ICitizen;
    created_at: string;
}

export namespace IBbsMember
{
    export interface IJoin
    {
        email: string;
        password: string;
        citizen: ICitizen.IStore;
    }

    export interface ILogin
    {
        email: string;
        password: string;
    }

    export interface IChangePassword
    {
        oldbie: string;
        newbie: string;
    }

    export interface IResetPassword
    {
        mobile: string;
    }
}