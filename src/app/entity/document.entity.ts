export class DocumentEntity {

    basePath: string;
    definitions: { [unknown: string]: any }; // 示例: {AddFHPredefineUserDTO: {type: "object", required: ["name", "value"]}}
    host: string;
    info: { version: string, title: string, description: string };
    paths: {};
    tags: Array<{ name: string, description: string }>;
    swagger: string;
}