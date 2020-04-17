import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, RouterState, Route, ActivationEnd } from '@angular/router';
import { APIGroupChanageObservable } from 'src/app/observables/api-group-chanage.observable';
import { DocumentDetailEntity } from 'src/app/entity/document-detail.entity';
import { DocumentService } from 'src/app/service/docuemtn.service';
import { DocumentEntity } from 'src/app/entity/document.entity';
import { DocumentDetailComponent } from '../document-detail/document-detail.component';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  doc: DocumentEntity;
  documentDetail: DocumentDetailEntity;
  synopsisPage = true;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private groupObservable: APIGroupChanageObservable) {
    let apiName;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let documentGroupName = this.activatedRoute.snapshot.params['group'];
        this.documentService.setCurrentDocumentGroup(documentGroupName);
        this.groupObservable.emit(documentGroupName);
        this.synopsisPage = true;
        this.documentService.getDocument(documentGroupName).subscribe(res => {
          this.synopsisPage = event.url.lastIndexOf("/synopsis") != -1 || event.url.split("/").length == 3; // 示例: /doc/admin
          this.doc = res;
          if (apiName) { // 存在接口名称,找到对应接口的详细信息
            this.documentDetail = this.findCurrentDocumentDetail(res, apiName);
          }
        });
      }
      // 满足该条件表示当前路由是在文档详情
      if (event instanceof ActivationEnd && event.snapshot.routeConfig.component.name == DocumentDetailComponent.name) {
        apiName = event.snapshot.params['api'];
      }
    });
  }

  ngOnInit() {
  }

  findCurrentDocumentDetail(doc: DocumentEntity, apiName: string): DocumentDetailEntity {
    for (const path in doc.paths) {
      let methods = doc.paths[path];
      for (const method in methods) {
        let detail = methods[method];
        if (detail["summary"] == apiName) {
          return new DocumentDetailEntity(path, method, detail, doc);
        }
      }
    }
    return null;
  }
  onClickAPIPath(path: string, method: string, detail: any): void {
    this.documentDetail = new DocumentDetailEntity(path, method, detail, this.doc);
  }
}
