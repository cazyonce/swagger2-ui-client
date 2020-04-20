import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentComponent } from './pages/document/document.component';
import { AppComponent } from './app.component';
import { DocumentDetailComponent } from './pages/document-detail/document-detail.component';
import { DocumentSynopsisComponent } from './pages/document-synopsis/document-synopsis.component';

const routes: Routes = [

  { path: '', pathMatch: 'full', redirectTo: '/doc/example' },

  {
    path: "doc/:group", component: DocumentComponent,
    children: [
      { path: "", pathMatch: 'full', redirectTo: 'synopsis' },
      { path: "synopsis", component: DocumentSynopsisComponent },
      { path: ":api", component: DocumentDetailComponent },
    ]
  },
  // { path: 'doc/:source_name', loadChildren: () => import('./pages/document/document.module').then(m => m.AppModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
