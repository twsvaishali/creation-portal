import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService
} from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { CbseProgramService } from '../../services';
import { TelemetryService } from '@sunbird/telemetry';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { DashboardComponent } from './dashboard.component';
import { FormsModule } from '@angular/forms';
import { AppLoaderComponent } from '../../../shared/components/app-loader/app-loader.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { role, sessionContext, sampleTextbook, textbookList, chapterlistSample, textbookMeta } from './dashboard.component.spec.data';
import { of as observableOf, throwError as observableError } from 'rxjs';
import { CoreModule, ActionService, UserService, PublicDataService, ContentService } from '@sunbird/core';
import * as _ from 'lodash-es';
import { ExportToCsv } from 'export-to-csv';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
    // tslint:disable-next-line:prefer-const
  let errorInitiate;
  const actionServiceStub = {
    get() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(sampleTextbook);
      }
    }
  };

  const ContentServiceStub = {
    post() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf(textbookList);
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule],
      declarations: [ DashboardComponent, AppLoaderComponent ],
      // tslint:disable-next-line:max-line-length
      providers: [ConfigService, UtilService, ToasterService, CbseProgramService, TelemetryService, ResourceService, CacheService, BrowserCacheTtlService,
                     // tslint:disable-next-line:max-line-length
                     { provide: ContentService, useValue: ContentServiceStub }, { provide: ActionService, useValue: actionServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.dashboardComponentInput = {sessionContext: sessionContext};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initiate component with default Program Level Report', () => {
    expect(component.selectedReport).toEqual('Program Level Report Status');
  });

  it('tableData should be loaded on component initialize', () => {
    expect(component.tableData).toBeDefined();
  });

  it('should have same table rows textbook list count', () => {
    expect(component.tableData.length).toEqual(component.textbookList.length);
  });

  it('should execute generateProgramLevelData on component initialize', () => {
    spyOn(component, 'generateProgramLevelData');
    component.ngOnInit();
    expect(component.generateProgramLevelData).toHaveBeenCalledWith('Program Level Report Status');
  });

  it('should execute generateTableData on component initialize', () => {
    spyOn(component, 'generateTableData');
    component.ngOnInit();
    expect(component.generateTableData).toHaveBeenCalledWith('Program Level Report Status');
  });

  it('should initialize dataTable and stop loading', () => {
    component.showLoader = true;
    fixture.detectChanges();
    component.initializeDataTable('Program Level Report Status');
    expect(component.showLoader).toBeFalsy();
  });

  it('on refresh it should go for api call to fetch text-book', () => {
    component.contentService.post = jasmine.createSpy(' search call spy').and.callFake(() => {
      return observableOf(textbookList);
    });
     component.refreshReport();
     expect(component.contentService.post).toHaveBeenCalled();
  });

  it('on download generateCsv should be called', () => {
    spyOn(ExportToCsv.prototype, 'generateCsv').and.callFake((a) => {
    alert('csv generated');
   });
      spyOn(window, 'alert');
    component.downloadReport();
    expect(window.alert).toHaveBeenCalled();
  });

});
