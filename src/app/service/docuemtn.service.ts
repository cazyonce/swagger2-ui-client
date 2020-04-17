import { DocumentEntity } from '../entity/document.entity';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class DocumentService {

    private docs = new Map<string, DocumentEntity>();
    private currentDocumentGroup: string;

    constructor(private http: HttpClient) { }

    getDocument(groupName: string): Observable<DocumentEntity> {
        let doc = this.docs.get(groupName);
        if (doc) {
            return of(doc);
        }
        return this.http.get(`v2/api-docs?group=${groupName}`).pipe(mergeMap((res: DocumentEntity) => {
            this.docs.set(groupName, res);
            return of(res);
        }));
    }

    setCurrentDocumentGroup(name: string): void {
        this.currentDocumentGroup = name;
    }

    getCurrentDocument(): DocumentEntity {
        return this.currentDocumentGroup ? this.docs.get(this.currentDocumentGroup) : null;
    }
}