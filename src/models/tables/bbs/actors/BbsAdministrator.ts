import * as orm from "typeorm";
import safe from "safe-typeorm";

import { BbsMember } from "./BbsMember";

@orm.Entity()
export class BbsAdministrator extends safe.Model
{
    /* -----------------------------------------------------------
        COLUMNS
    ----------------------------------------------------------- */
    @safe.Belongs.OneToOne(() => BbsMember,
        member => member.administrator,
        "uuid",
        "member_id",
        { primary: true }
    )
    public readonly base!: safe.Belongs.OneToOne<BbsMember, "uuid">;
}