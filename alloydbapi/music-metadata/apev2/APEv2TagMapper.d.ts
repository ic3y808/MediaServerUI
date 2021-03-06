import { CommonTagMapper } from "../common/GenericTagMapper";
export declare class APEv2TagMapper extends CommonTagMapper {
    constructor();
    /**
     * @tag  Native header tag
     * @return common tag name (alias)
     */
    protected getCommonName(tag: string): import("../common/GenericTagTypes").GenericTagId;
}
