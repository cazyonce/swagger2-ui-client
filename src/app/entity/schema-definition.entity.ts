import { PropertieEntity } from './propertie.entity';

export class SchemaDefinintionEntity {
    properties: { [unknown: string]: PropertieEntity };
    required: Array<string>; // 存储的是属性名
    title: string;
    type: "object" | "array";

    isObjectType(): boolean {
        return this.type === "object";
    }

    isArrayType(): boolean {
        return this.type === "array";
    }
}