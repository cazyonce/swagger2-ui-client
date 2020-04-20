import { SchemaDefinintionEntity } from './schema-definition.entity';

export class ResponseEntity {

    description: string;
    schema: { $ref: string }; // $ref 示例:#/definitions/TokenDTO

    // 以下属性均为之后进行逻辑处理添加的
    hiddenName: boolean; // 页面是否需要显示该参数名称


    leftSymbol: string; // 左半部分的符号
    rightSymbol: string; // 右半部分的符号
    definition: SchemaDefinintionEntity;
    expandKey: string;


}