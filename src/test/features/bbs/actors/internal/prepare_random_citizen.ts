import { ICitizen } from "../../../../../api/structures/common/ICitizen";
import { RandomGenerator } from "../../../../../utils/RandomGenerator";

export function prepare_random_citizen(): ICitizen
{
    return {
        mobile: RandomGenerator.mobile(),
        name: RandomGenerator.name()
    }
}