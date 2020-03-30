import { ExtPluginService, UserService, FrameworkService, ProgramsService } from '@sunbird/core';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService, ResourceService, ToasterService, NavigationHelperService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { tap, first, map, catchError} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ICollectionComponentInput, IDashboardComponentInput } from '../../../cbse-program/interfaces';
import { InitialState, ISessionContext, IUserParticipantDetails } from '../../interfaces';
import { ProgramStageService } from '../../services/';
import { ProgramComponentsService} from '../../services/program-components/program-components.service';
import { IImpressionEventInput } from '@sunbird/telemetry';
interface IDynamicInput {
  collectionComponentInput?: ICollectionComponentInput;
  dashboardComponentInput?: IDashboardComponentInput;
}
@Component({
  selector: 'app-program-component',
  templateUrl: './program.component.html'
})
export class ProgramComponent implements OnInit, OnDestroy, AfterViewInit {
  public programId: string;
  public programDetails: any;
  public userProfile: any;
  public showLoader = true;
  public showTabs = true;
  public showOnboardPopup = false;
  public programSelected = false;
  public associatedPrograms: any;
  public headerComponentInput: any;
  public stageSubscription: any;
  public tabs;
  public showStage;
  public defaultView;
  public dynamicInputs: IDynamicInput;
  public component: any;
  public sessionContext: ISessionContext = {};
  public state: InitialState = {
    stages: []
  };
  public currentStage: any;
  public telemetryImpression: IImpressionEventInput;
  outputs = {
    isCollectionSelected: (check) => {
      this.showTabs = false;
    }
  };
  nominated;
  nominationDetails;
  currentNominationStatus;
  public telemetryPageId = 'collection';
  constructor(public frameworkService: FrameworkService, public resourceService: ResourceService,
    public configService: ConfigService, public activatedRoute: ActivatedRoute, private router: Router,
    public extPluginService: ExtPluginService, public userService: UserService,
    public toasterService: ToasterService, public programStageService: ProgramStageService,
    public programComponentsService: ProgramComponentsService, public programsService: ProgramsService,
    private navigationHelperService: NavigationHelperService) {
    this.programId = this.activatedRoute.snapshot.params.programId;
    localStorage.setItem('programId', this.programId);
  }
  ngOnInit() {
    this.sessionContext.nominationFetched =  false;

   this.fetchProgramDetails().subscribe((programDetails) => {
      this.programsService.getNominationStatus(this.programId, this.sessionContext).subscribe(
        res => {
          this.showOnboardPopup = false;
          this.initiateHeader('success');
        },
        error => {
          const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
          this.toasterService.error(errorMes || 'Fetching Nomination details failed');
          this.initiateHeader('failed');
        });
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
      this.initiateHeader('failed');
    });

    /*this.programStageService.initialize();
    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });*/
    if (['null', null, undefined, 'undefined'].includes(this.programId)) {
      console.log('no programId found'); // TODO: need to handle this case
    }
  }
  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const telemetryCdata = [{ 'type': 'Program', 'id': this.programId }];
    setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activatedRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata || [],
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: `${this.configService.appConfig.TELEMETRY.PID}.programs`
          }
        },
        edata: {
          type: _.get(this.activatedRoute, 'snapshot.data.telemetry.type'),
          pageid: this.telemetryPageId,
          uri: this.router.url,
          subtype: _.get(this.activatedRoute, 'snapshot.data.telemetry.subtype'),
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
    });
  }

  /*initiateOnboarding() {
    this.fetchProgramDetails().subscribe((programDetails) => {
      this.showOnboardPopup = false;
      this.initiateHeader('success');
    }, error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
      this.initiateHeader('failed');
    });
  }*/

  fetchProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    return this.programsService.get(req).pipe(tap((programDetails: any) => {
      programDetails.result.config = JSON.parse(programDetails.result.config);
      this.programDetails = programDetails.result;
      //this.mediums = _.join(this.programDetails.config['medium'], ', ');
      //this.grades = _.join(this.programDetails.config['gradeLevel'], ', ');

      this.sessionContext.framework = _.get(this.programDetails, 'config.framework');
      if (this.sessionContext.framework) {
        this.fetchFrameWorkDetails();
      }
    }));
  }

  public fetchFrameWorkDetails() {
    this.frameworkService.initialize(this.sessionContext.framework);
    this.frameworkService.frameworkData$.pipe(first()).subscribe((frameworkDetails: any) => {
      if (frameworkDetails && !frameworkDetails.err) {
        this.sessionContext.frameworkData = frameworkDetails.frameworkdata[this.sessionContext.framework].categories;
      }
    }, error => {
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching framework details failed');
    });
  }

  /*handleOnboarding() {
    const checkUserParticipentData = _.has(this.programDetails, 'userDetails') ? true : false;
    if (checkUserParticipentData) {
      this.showOnboardPopup = false;
      this.initiateHeader('success');
    } else if (_.has(this.programDetails.config, 'onBoardingForm')) {
      this.showOnboardPopup = true;
      //  this.initiateHeader('success');
    } else {
      this.userOnboarding();
    }
  }
  userOnboarding(): any {
    const req = {
      url: `program/v1/add/participant`,
      data: {
        request: {
          programId: this.programDetails.programId,
          userId: this.userService.userid,
          onBoarded: true
        }
      }
    };
    this.extPluginService.post(req).subscribe((data) => {
      this.setUserParticipantDetails({
        data: data,
        onBoardingData: {}
      });
    }, error => {
      this.toasterService.error(_.get(error, 'error.params.errmsg') || 'User onboarding failed');
    });
  }

  setUserParticipantDetails(event) {
    this.showOnboardPopup = false;
    const userDetails: IUserParticipantDetails = {
      enrolledOn: event.data.ts,
      onBoarded: true,
      onBoardingData: event.onBoardingData,
      programId: event.data.result.programId,
      roles: ['CONTRIBUTOR'], // TODO: get default role from config
      userId: this.userService.userid
    };
    this.programDetails['userDetails'] = userDetails;
    this.initiateHeader('success');
  }*/

  initiateInputs() {
    this.sessionContext.programId = this.programDetails.program_id;
    this.showLoader = false;
    this.headerComponentInput = {
      programDetails: this.programDetails,
      sessionContext: this.sessionContext
    };
    this.dynamicInputs = {
      collectionComponentInput: {
        sessionContext: this.sessionContext,
        userProfile: this.userProfile,
        config: _.find(this.programDetails.config.components, { 'id': 'ng.sunbird.collection' }),
        programContext: this.programDetails
      },
      dashboardComponentInput: {
        sessionContext: this.sessionContext,
        programContext: this.programDetails
      }
    };
  }
  initiateHeader(status) {
    if (status === 'success') {
      this.component = this.programComponentsService.getComponentInstance('collectionComponent');
      this.tabs = _.get(this.programDetails.config, 'header.config.tabs');
      if (this.tabs && this.programDetails.userDetails) {
        this.defaultView = _.find(this.tabs, { 'index': this.getDefaultActiveTab() });
        this.programStageService.addStage(this.defaultView.onClick);
        this.component = this.programComponentsService.getComponentInstance(this.defaultView.onClick);
      }
      this.initiateInputs();
    } else {
      this.toasterService.error('Fetching program details failed');
    }
  }

  /*getNominationStatus() {
    const req = {
      url: `${this.configService.urlConFig.URLS.CONTRIBUTION_PROGRAMS.NOMINATION_LIST}`,
      data: {
        request: {
          filters: {
            program_id: this.activatedRoute.snapshot.params.programId
          }
        }
      }
    };
    if (this.userService.userProfile.userRegData && this.userService.userProfile.userRegData.User_Org) {
      req.data.request.filters['organisation_id'] = this.userService.userProfile.userRegData.User_Org.orgId;
    } else {
      req.data.request.filters['user_id'] = this.userService.userProfile.userId;
    }

    return this.programsService.post(req).subscribe((data) => {
      if (data.result && !_.isEmpty(data.result)) {
        this.nominated = true;
        this.nominationDetails = _.first(data.result);
        this.sessionContext.nominationDetails = _.first(data.result);
        this.currentNominationStatus =  _.get(_.first(data.result), 'status');
        if (this.userService.userProfile.userRegData && this.userService.userProfile.userRegData.User_Org) {
          this.sessionContext.currentOrgRole = this.userService.userProfile.userRegData.User_Org.roles[0];
          if (this.userService.userProfile.userRegData.User_Org.roles[0] === 'admin') {
            // tslint:disable-next-line:max-line-length
            this.sessionContext.currentRole = (this.currentNominationStatus === 'Approved' ||  this.currentNominationStatus === 'Rejected') ? 'REVIEWER' : 'CONTRIBUTOR';
          } else if (this.sessionContext.nominationDetails && this.sessionContext.nominationDetails.rolemapping) {
              _.find(this.sessionContext.nominationDetails.rolemapping, (users, role) => {
                if (_.includes(users, this.userService.userProfile.userRegData.User.userId)) {
                  this.sessionContext.currentRole = role;
                }
            });
          } else {
            this.sessionContext.currentRole = 'CONTRIBUTOR';
          }
        } else {
          this.sessionContext.currentRole = 'CONTRIBUTOR';
          this.sessionContext.currentOrgRole = 'individual';
        }
        if (this.programDetails.config) {
          const getCurrentRoleId = _.find(this.programDetails.config.roles, {'name': this.sessionContext.currentRole});
          this.sessionContext.currentRoleId = (getCurrentRoleId) ? getCurrentRoleId.id : null;
        }
      }
    }, error => {
      this.toasterService.error('Failed fetching current nomination status');
    });
  }*/

  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
    }
  }

  getDefaultActiveTab() {
    const defaultView = _.find(this.programDetails.config.roles, { 'name': this.programDetails.userDetails.roles[0] });
    return (defaultView) ? defaultView.defaultTab : 1;
  }

  tabChangeHandler(e) {
    this.component = this.programComponentsService.getComponentInstance(e);
  }

  ngOnDestroy() {
    this.stageSubscription.unsubscribe();
  }
}
