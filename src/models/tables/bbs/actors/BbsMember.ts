import * as orm from "typeorm";
import safe from "safe-typeorm";

import { BbsAdministrator } from "./BbsAdministrator";
import { BbsCustomer } from "./BbsCustomer";
import { BbsManager } from "./BbsManager";
import { Citizen } from "../../common/Citizen";

@orm.Entity()
export class BbsMember extends safe.Model
{
    @orm.PrimaryGeneratedColumn("uuid")
    public readonly id!: string;

    @orm.Index({ unique: true })
    @orm.Column("varchar")
    public readonly email!: string;
    
    @safe.Belongs.ManyToOne(() => Citizen,
        "uuid",
        "citizen_id",
        { index: true }
    )
    public readonly citizen!: safe.Belongs.ManyToOne<Citizen, "uuid">;

    @orm.Column(() => safe.Password)
    public readonly password: safe.Password = new safe.Password();

    @orm.CreateDateColumn()
    public readonly created_at!: Date;

    /* -----------------------------------------------------------
        HAS
    ----------------------------------------------------------- */
    @safe.Has.OneToOne
    (
        () => BbsAdministrator,
        admin => admin.base
    )
    public readonly administrator!: safe.Has.OneToOne<BbsAdministrator>;

    @safe.Has.OneToOne
    (
        () => BbsManager,
        manager => manager.base
    )
    public readonly manager!:safe.Has.OneToOne<BbsManager>;

    @safe.Has.OneToMany
    (
        () => BbsCustomer as safe.Model.Creator<BbsCustomer<true>>,
        customer => customer.member,
        (x, y) => x.created_at.getTime() - y.created_at.getTime()
    )
    public readonly customers!: safe.Has.OneToMany<BbsCustomer<true>>;
}