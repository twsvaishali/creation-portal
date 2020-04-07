import { IImpressionEventInput, IInteractEventEdata } from '@sunbird/telemetry';
import { ResourceService, ConfigService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { ProgramsService, PublicDataService, UserService, FrameworkService, RegistryService } from '@sunbird/core';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { tap, first } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import * as _ from 'lodash-es';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ICollectionComponentInput, IDashboardComponentInput } from '../../../cbse-program/interfaces';
import { ProgramStageService } from '../../../program/services/program-stage/program-stage.service';
import { ProgramComponentsService} from '../../services/program-components/program-components.service';
import { ChapterListComponent } from '../../../cbse-program/components/chapter-list/chapter-list.component';
import { IChapterListComponentInput } from '../../../cbse-program/interfaces';
import { InitialState, ISessionContext } from '../../interfaces';
import * as moment from 'moment';
interface IDynamicInput {
  collectionComponentInput?: ICollectionComponentInput;
  dashboardComponentInput?: IDashboardComponentInput;
  chapterListComponentInput?: any;
  usersListComponentInput?: any;
}

@Component({
  selector: 'app-program-component',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss']
})
export class ProgramComponent implements OnInit, AfterViewInit, OnDestroy {

  //public contributorTextbooks: any = [];
 //  public noResultFound;

  public telemetryImpression: IImpressionEventInput;
  public component: any;
  public sessionContext: ISessionContext = {};
  public chapterListComponentInput: IChapterListComponentInput = {};
  public dynamicInputs: IDynamicInput;
  public currentStage: any;
  //collection;
  //configData;
  showChapterList = false;
  //public currentNominationStatus: any;
  //public nominationDetails: any = {};
  //public nominated = false;
  public programId: string;
  public programDetails: any;
  public showLoader = true;
  public tabs;
  public defaultView;
  //public showTabs = true;
  public mediums: any;
  public grades: any;
  public userProfile: any;
  public activeDate = '';
  public showUsersTab = false;
  public headerComponentInput: any;
  public stageSubscription: any;
  public state: InitialState = {
    stages: []
  };
  /*outputs = {
    isCollectionSelected: (check) => {
      this.showTabs = false;
    }
  };*/
  public contributorOrgUser: any = [];
  public orgDetails: any = {};
  public roles;
  //public selectedRole;
  public telemetryInteractCdata: any;
  public telemetryInteractPdata: any;
  public telemetryInteractObject: any = {};

  constructor(private programsService: ProgramsService, public resourceService: ResourceService,
  private configService: ConfigService, private publicDataService: PublicDataService,
  private activatedRoute: ActivatedRoute, private router: Router, public programStageService: ProgramStageService,
  public toasterService: ToasterService, private navigationHelperService: NavigationHelperService,  private httpClient: HttpClient,
  public frameworkService: FrameworkService, public userService: UserService,
  public registryService: RegistryService, public programComponentsService: ProgramComponentsService,
  public activeRoute: ActivatedRoute) {
    this.programId = this.activatedRoute.snapshot.params.programId;
   }

  ngOnInit() {
    this.sessionContext.nominationFetched =  false;

    const tempProgramDetails = this.fetchProgramDetails();
    const tempnominationDetails = this.programsService.getNominationStatus(this.programId, this.sessionContext);

      forkJoin([tempProgramDetails, tempnominationDetails]).subscribe(([response1, response2]) => {
        this.initiateHeader('success');

        if (!_.isEmpty(this.userService.userProfile.userRegData) &&
        this.userService.userProfile.userRegData.User_Org &&
        this.userService.userProfile.userRegData.User_Org.roles.includes('admin') &&
        !_.isEmpty(this.sessionContext.nominationDetails)) {
          this.showUsersTab = true;
          this.getContributionOrgUsers();
        }
    },
    error => {
      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
      this.initiateHeader('failed');
    });

    /*this.fetchProgramDetails().subscribe(
      programDetails => {

        this.programsService.getNominationStatus(this.programId, this.sessionContext).subscribe(
          res => {
            this.initiateHeader('success');
            if (!_.isEmpty(this.userService.userProfile.userRegData) &&
            this.userService.userProfile.userRegData.User_Org &&
            this.userService.userProfile.userRegData.User_Org.roles.includes('admin')) {
              this.getContributionOrgUsers();
              this.showUsersTab = true;
            }
          },
          error => {
            const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
            this.toasterService.error(errorMes || 'Fetching Nomination details failed');
            this.initiateHeader('failed');
          });
      },
      error => {

      // TODO: navigate to program list page
      const errorMes = typeof _.get(error, 'error.params.errmsg') === 'string' && _.get(error, 'error.params.errmsg');
      this.toasterService.error(errorMes || 'Fetching program details failed');
      this.initiateHeader('failed');
    });*/

    /*this.getProgramTextbooks();*/
    this.programStageService.initialize();

    this.stageSubscription = this.programStageService.getStage().subscribe(state => {
      this.state.stages = state.stages;
      this.changeView();
    });
    this.programStageService.addStage('ProgramComponent');

    //this.currentStage = 'ProgramComponent';

    this.telemetryInteractCdata = [{
      id: this.activatedRoute.snapshot.params.programId,
      type: 'Program_ID'
    }];
    this.telemetryInteractPdata = {
      id: this.userService.appId,
      pid: this.configService.appConfig.TELEMETRY.PID
    };
    console.log(this.currentStage);
  }

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
        userProfile: this.userService.userProfile,
        config: _.find(this.programDetails.config.components, { 'id': 'ng.sunbird.collection' }),
        programContext: this.programDetails
      },
      usersListComponentInput: {
        sessionContext: this.sessionContext,
        programContext: this.programDetails
      }
    };
  }

  initiateHeader(status) {
    if (status === 'success') {
      /*this.tabs = [
        {index: 1, label: this.resourceService.frmelmnts.lbl.textbooks, onClick: "collectionComponent"},
        {index: 2, label: this.resourceService.frmelmnts.lbl.textbooks, onClick: "UsersListComponent"},
      ];*/

      this.component = this.programComponentsService.getComponentInstance('collectionComponent');

      /*if (this.tabs && this.programDetails.userDetails) {
        this.defaultView = _.find(this.tabs, { 'index': this.getDefaultActiveTab() });
        this.programStageService.addStage(this.defaultView.onClick);
        this.component = this.programComponentsService.getComponentInstance(this.defaultView.onClick);
      }*/
      this.initiateInputs();
    } else {
      this.toasterService.error('Fetching program details failed');
    }
  }

  getDefaultActiveTab() {
    return 1;

    /*const defaultView = _.find(this.programDetails.config.roles, { 'name': this.programDetails.userDetails.roles[0] });
    return (defaultView) ? defaultView.defaultTab : 1;*/
  }

  fetchProgramDetails() {
    const req = {
      url: `program/v1/read/${this.programId}`
    };
    return this.programsService.get(req).pipe(tap((programDetails: any) => {
      programDetails.result.config = JSON.parse(programDetails.result.config);
      this.programDetails = programDetails.result;
      //this.programContext = this.programDetails;
      //this.mediums = _.join(this.programDetails.config['medium'], ', ');
      //this.grades = _.join(this.programDetails.config['gradeLevel'], ', ');
      //this.roles = _.get(this.programDetails, 'config.roles');
      this.setActiveDate();

      this.sessionContext.framework = _.get(this.programDetails, 'config.framework');
      /*if (this.sessionContext.framework) {
        this.fetchFrameWorkDetails();
      }*/
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

  ngAfterViewInit() {
    const buildNumber = (<HTMLInputElement>document.getElementById('buildNumber'));
    const version = buildNumber && buildNumber.value ? buildNumber.value.slice(0, buildNumber.value.lastIndexOf('.')) : '1.0';
    const deviceId = <HTMLInputElement>document.getElementById('deviceId');
    const telemetryCdata = [{ 'type': 'Program_ID', 'id': this.activatedRoute.snapshot.params.programId }];
     setTimeout(() => {
      this.telemetryImpression = {
        context: {
          env: this.activeRoute.snapshot.data.telemetry.env,
          cdata: telemetryCdata,
          pdata: {
            id: this.userService.appId,
            ver: version,
            pid: this.configService.appConfig.TELEMETRY.PID
          },
          did: deviceId ? deviceId.value : ''
        },
        edata: {
          type: _.get(this.activeRoute, 'snapshot.data.telemetry.type'),
          pageid: _.get(this.activeRoute, 'snapshot.data.telemetry.pageid'),
          uri: this.router.url,
          duration: this.navigationHelperService.getPageLoadTime()
        }
      };
     });
  }

  viewContribution(collection) {
    this.component = ChapterListComponent;
    this.sessionContext.programId = this.programDetails.program_id;
    this.sessionContext.collection =  collection.identifier;
    this.sessionContext.collectionName = collection.name;
    this.dynamicInputs = {
      chapterListComponentInput: {
        sessionContext: this.sessionContext,
        collection: collection,
        config: _.find(this.programDetails.config.components, {'id': 'ng.sunbird.chapterList'}),
        programContext: this.programDetails,
        role: {
          currentRole : this.sessionContext.currentRole
        }
      }
    };
    this.showChapterList = true;
    this.programStageService.addStage('chapterListComponent');
  }

  canUploadContent() {
    const contributionendDate  = moment(this.programDetails.content_submission_enddate);
    const endDate  = moment(this.programDetails.enddate);
    const today = moment();
    return (contributionendDate.isSameOrAfter(today, 'day') && endDate.isSameOrAfter(today, 'day')) ? true : false;
  }

   setActiveDate() {
    const dates = [ 'nomination_enddate', 'shortlisting_enddate', 'content_submission_enddate', 'enddate'];

    dates.forEach(key => {
      const date  = moment(moment(this.programDetails[key]).format('YYYY-MM-DD'));
      const today = moment(moment().format('YYYY-MM-DD'));
      const isFutureDate = !date.isSame(today) && date.isAfter(today);

      if (key === 'nomination_enddate' && isFutureDate) {
        this.activeDate = key;
      }

      if (this.activeDate === '' && isFutureDate) {
        this.activeDate = key;
      }
    });
  }

  getContributionOrgUsers() {
    const baseUrl = ( <HTMLInputElement> document.getElementById('portalBaseUrl')) ?
      ( <HTMLInputElement> document.getElementById('portalBaseUrl')).value : '';
    if (this.userService.userProfile.userRegData && this.userService.userProfile.userRegData.User_Org) {
      const orgUsers = this.registryService.getContributionOrgUsers(this.userService.userProfile.userRegData.User_Org.orgId);
      this.orgDetails.name = this.userService.userProfile.userRegData.Org.name;
      this.orgDetails.id = this.userService.userProfile.userRegData.Org.osid;
      this.orgDetails.orgLink = `${baseUrl}contribute/join/${this.userService.userProfile.userRegData.Org.osid}`;
      orgUsers.subscribe(response => {
        const result = _.get(response, 'result');
        if (!result || _.isEmpty(result)) {
          console.log('NO USER FOUND');
        } else {
          // get Ids of all users whose role is 'user'
          const userIds = _.map(_.filter(result[_.first(_.keys(result))], ['roles', ['user']]), 'userId');
          const getUserDetails = _.map(userIds, id => this.registryService.getUserDetails(id));
          forkJoin(...getUserDetails)
            .subscribe((res: any) => {
              if (res) {
                _.forEach(res, r => {
                  if (r.result && r.result.User) {
                    let creator = r.result.User.firstName;
                    if (r.result.User.lastName) {
                      creator = creator + r.result.User.lastName;
                    }
                    r.result.User.fullName = creator;
                    if (this.sessionContext.nominationDetails && this.sessionContext.nominationDetails.rolemapping) {
                      _.find(this.sessionContext.nominationDetails.rolemapping, (users, role) => {
                        if (_.includes(users, r.result.User.userId)) {
                          r.result.User.selectedRole = role;
                        }
                      });
                    }
                    this.contributorOrgUser.push(r.result.User);
                  }
                });
              }
            }, error => {
              console.log(error);
            });
        }
      }, error => {
        console.log(error);
      });
    }
  }

  onRoleChange() {
    const roleMap = {};
    _.forEach(this.roles, role => {
      roleMap[role.name] = _.filter(this.contributorOrgUser, user => {
        if (user.selectedRole === role.name) {  return user.userId; }
      }).map(({userId}) => userId);
    });
    const req = {
      'request': {
          'program_id': this.activatedRoute.snapshot.params.programId,
          'user_id': this.userService.userid,
          'rolemapping': roleMap
      }
    };
    const updateNomination = this.programsService.updateNomination(req);
    updateNomination.subscribe(response => {
      this.toasterService.success('Roles updated');
    }, error => {
      console.log(error);
    });
  }

  changeView() {
    if (!_.isEmpty(this.state.stages)) {
      this.currentStage = _.last(this.state.stages).stage;
    }
  }

  getTelemetryInteractEdata(id: string, type: string, pageid: string, extra?: string): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      pageid,
      extra
    }, _.isUndefined);
  }


  ngOnDestroy() {
    //this.stageSubscription.unsubscribe();
  }
}
