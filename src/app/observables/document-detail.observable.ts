import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { DocumentDetailEntity } from '../entity/document-detail.entity';

@Injectable({
    providedIn: "root"
})
export class DocumentDetailObservable {

    private subscriber: Subscriber<DocumentDetailEntity>;

    private observable = new Observable<DocumentDetailEntity>(
        (observer: Subscriber<DocumentDetailEntity>) => {
            this.subscriber = observer;
        });

    emit(info: DocumentDetailEntity): void {
        this.subscriber.next(info)
    }

    getObservable(): Observable<DocumentDetailEntity> {
        return this.observable;
    }
}