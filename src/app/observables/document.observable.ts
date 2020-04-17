import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { DocumentEntity } from '../entity/document.entity';

@Injectable({
    providedIn: "root"
})
export class DocumentObservable {

    private subscriber: Subscriber<DocumentEntity>;

    private observable = new Observable<DocumentEntity>(
        (observer: Subscriber<DocumentEntity>) => {
            this.subscriber = observer;
        });

    emit(info: DocumentEntity): void {
        this.subscriber.next(info)
    }

    getObservable(): Observable<any> {
        return this.observable;
    }
}