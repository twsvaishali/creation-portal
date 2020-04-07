import { ProgramsService, EnrollContributorService } from '@sunbird/core';
import { ListAllProgramsComponent } from './components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent } from './components';
import { ListAllMyProgramsComponent } from './components/list-all-my-programs/list-all-my-programs.component';
import { OrgUserListComponent } from './components/org-user-list/org-user-list.component';
import { OrgContriAdminComponent } from './components/org-contri-admin/org-contri-admin.component';
import { ContriDashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [{
  path: '', component: ListAllProgramsComponent, canActivate: [ProgramsService],
  data: {
    telemetry: {
      env: 'creation-portal', pageid: 'list-all-programs', type: 'view', subtype: 'paginate'
    }
  }
},
{
  path: 'join/:orgId', component: ListAllMyProgramsComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'programs', type: 'view', subtype: 'paginate' }
  },
},
{
  path: 'myenrollprograms', component: ListAllMyProgramsComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'list-my-programs' }
  },
},
{
  path: 'program/:programId', component: ProgramComponent,
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'program' }
  },
},
{
  path: 'orglist', component: OrgUserListComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'list-org-users' }
  },
},
{
  path: 'contriadmin', component: OrgContriAdminComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'org-admin' }
  },
},
{
  path: 'dashboard', component: ContriDashboardComponent, pathMatch: 'full',
  data: {
    telemetry: { env: 'creation-portal', type: 'view', subtype: 'paginate', pageid: 'dashboard' }
  },
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContributeRoutingModule { }
