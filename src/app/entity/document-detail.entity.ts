import { DocumentEntity } from './document.entity';
import { ParameterEntity } from './parameter.entity';

export class DocumentDetailEntity {

    path: string;
    method: string;
    detail: { parameters: Array<ParameterEntity> };
    doc: DocumentEntity;

    constructor(path: string, method: string, detail: { parameters: Array<ParameterEntity> }, doc: DocumentEntity) {
        this.path = path;
        this.method = method;
        this.detail = detail;
        this.doc = doc;
    }
}