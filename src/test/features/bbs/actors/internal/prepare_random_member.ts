import { IBbsMember } from "../../../../../api/structures/bbs/actors/IBbsMember";
import { ICitizen } from "../../../../../api/structures/common/ICitizen";

import { Configuration } from "../../../../../Configuration";
import { RandomGenerator } from "../../../../../utils/RandomGenerator";
import { prepare_random_citizen } from "./prepare_random_citizen";

export function prepare_random_member(citizen?: ICitizen.IStore): IBbsMember.IJoin
{
    return {
        citizen: citizen || prepare_random_citizen(),
        email: `${RandomGenerator.alphabets(16)}@samchon.org`,
        password: Configuration.SYSTEM_PASSWORD
    };
}