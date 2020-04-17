import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { APIGroupChanageObservable } from './observables/api-group-chanage.observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // isCollapsed = false;
  //Array<{name:string,url:string,swaggerVersion:string,location:string}>;
  apiGroups;
  selectedAPIGroup: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private groupObservable: APIGroupChanageObservable) {

    this.groupObservable.getObservable().subscribe(groupName => {
      this.selectedAPIGroup = groupName;
    });
    this.http.get("swagger-resources").subscribe(res => {
      this.apiGroups = res;
    });
  }

  onSwitchAPIGroup(resourceName: string) {
    this.router.navigateByUrl(`/doc/${resourceName}`)
  }
}
