import { ParameterEntity } from './parameter.entity';
import { ResponseEntity } from './response.entity';

export class ApiDetailEntity {

    consumes: { [index: number]: string }; // 示例： {0: "application/json"}
    deprecated: boolean;
    operationId: string;
    parameters: Array<ParameterEntity>;
    responses: { [code: number]: ResponseEntity };
    produces: Array<string>;
    summary: string;
    tags: Array<string>;
}