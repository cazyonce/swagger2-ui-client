import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
    providedIn: "root"
})
export class APIGroupChanageObservable {

    private subscriber: Subscriber<string>;
    private observable = new Observable<string>((observer: Subscriber<string>) => {
        this.subscriber = observer;
    });

    emit(groupName: string): void {
        this.subscriber.next(groupName)
    }
    
    getObservable(): Observable<any> {

        return this.observable;
    }
}