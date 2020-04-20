import { DocumentEntity } from './document.entity';
import { ApiDetailEntity } from './api-detail.entity';

export class DocumentDetailEntity {

    path: string;
    method: string;
    detail: ApiDetailEntity;
    doc: DocumentEntity;

    constructor(path: string, method: string, detail: ApiDetailEntity, doc: DocumentEntity) {
        this.path = path;
        this.method = method;
        this.detail = detail;
        this.doc = doc;
    }
}