import { Injectable } from '@angular/core';
import { CollectionComponent } from '../../../cbse-program/components/collection/collection.component';
import {DashboardComponent } from '../../../cbse-program/components/dashboard/dashboard.component';
import {UsersListComponent } from '../../../shared-feature/components/users-list/users-list.component';
import { ContentUploaderComponent } from '../../../cbse-program/components/content-uploader/content-uploader.component';
import { QuestionListComponent } from '../../../cbse-program/components/question-list/question-list.component';
import { ContentEditorComponent } from '../../../cbse-program/components/content-editor/content-editor.component';
import { ToasterService } from '@sunbird/shared';

@Injectable({
  providedIn: 'root'
})
export class ProgramComponentsService {
  private componentMapping = {
    dashboardComponent: DashboardComponent,
    collectionComponent: CollectionComponent,
    uploadComponent: ContentUploaderComponent,
    questionSetComponent: QuestionListComponent,
    curiositySetComponent: QuestionListComponent,
    usersListComponent: UsersListComponent,
    editorComponent: ContentEditorComponent
  };
  constructor(public toasterService: ToasterService) {

  }

  getComponentInstance(component) {
    if (!this.componentMapping[component]) {
      this.toasterService.error('Component not configured for the content type');
    }
    return this.componentMapping[component];
  }
}
