
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionPlayerComponent } from './collection-player.component';
import { ContentService, PlayerService, CoreModule } from '@sunbird/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WindowScrollService, ConfigService, SharedModule } from '../../../shared';
import { CollectionTreeComponent, AppLoaderComponent, PlayerComponent, FancyTreeComponent } from '../../../shared/components';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionHierarchyGetMockResponse } from './collection-player.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CollectionPlayerComponent', () => {
  let component: CollectionPlayerComponent;
  let fixture: ComponentFixture<CollectionPlayerComponent>;
  const collectionId = 'do_112270591840509952140';
  const contentId = 'domain_44689';

  const fakeActivatedRoute = {
    params: observableOf({ id: collectionId }),
    queryParams: observableOf({ contentId: contentId }),
    snapshot: {
      data: {
        telemetry: {
          env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionPlayerComponent],
      imports: [SuiModule, HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot(), RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPlayerComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.showPlayer).toBeFalsy();
    // expect(component.serviceUnavailable).toBeFalsy();
    expect(component.loader).toBeTruthy();
    expect(component.loaderMessage).toEqual({
      headerMessage: 'Please wait...',
      loaderMessage: 'Fetching content details!'
    });
    expect(component.collectionTreeOptions).toEqual({
      fileIcon: 'fa fa-file-o fa-lg',
      customFileIcon: {
        'video': 'fa fa-file-video-o fa-lg',
        'pdf': 'fa fa-file-pdf-o fa-lg',
        'youtube': 'fa fa-youtube fa-lg fancy_tree_red',
        'H5P': 'fa fa-html5 fa-lg',
        'audio': 'fa fa-file-audio-o fa-lg',
        'ECML': 'fa fa-file-code-o fa-lg',
        'HTML': 'fa fa-html5 fa-lg',
        'collection': 'fa fa-file-archive-o fa-lg',
        'epub': 'fa fa-file-text fa-lg',
        'doc': 'fa fa-file-text fa-lg'
      }
    });
  });

  it('should get content based on route/query params', () => {
    const playerService: PlayerService = TestBed.get(PlayerService);
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(playerService, 'getCollectionHierarchy').and
      .returnValue(observableOf(CollectionHierarchyGetMockResponse));
    component.ngOnInit();
    expect(component.collectionTreeNodes).toEqual({ data: CollectionHierarchyGetMockResponse.result.content });
    expect(component.loader).toBeFalsy();
  });

  it('should call onPlayContent and setContentNavigator method', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    const content = { id: 'do_112474267785674752118', title: 'Test' };
    component.collectionTreeNodes = CollectionHierarchyGetMockResponse.result.content;
    const playContentDetails = {
      model : {
        mimeType : 'application/vnd.ekstep.ecml-archive',
        channel: '505c7c48ac6dc1edc9b08f21db5a571d'
      }
    };
    spyOn(component, 'OnPlayContent').and.callThrough();
    spyOn(component, 'playContent').and.callThrough();
    component.OnPlayContent(content);
    expect(component.OnPlayContent).toHaveBeenCalledWith(content);
    expect(component.playContent).toHaveBeenCalledWith(content);
  });

  xit('should navigate to error page on invalid collection id', () => {});
  xit('should navigate to error page on valid collection id but invalid content id', () => {});
  xit('should show service unavailable message on API server error', () => {});
});
