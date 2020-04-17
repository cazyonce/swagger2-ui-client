import { SchemaDefinintionEntity } from './schema-definition.entity';

export class PropertieEntity {
    $ref: string; // 这个属性存在值时,默认不存在类型和其他属性. 示例值: #/definitions/用户续费参数
    type: "object" | "array" | "integer";
    items: { $ref: string }; // 当属性类型为array时,才会存在该属性
    description: string;
    format: string; // 例如当type类型为integer时 int64或int32

    // 以下属性是进行处理之后赋值的
    rightSymbol: string;
    leftSymbol: string;
    definition: SchemaDefinintionEntity;
    expandKey: string;

    isObjectType(): boolean {
        return this.type === "object";
    }

    isArrayType(): boolean {
        return this.type === "array";
    }
}