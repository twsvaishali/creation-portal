import { Component, OnInit, Input, Output, OnChanges, OnDestroy,  EventEmitter } from '@angular/core';
import * as _ from 'lodash-es';
import { ProgramsService, RegistryService, UserService } from '@sunbird/core';
import { ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import { tap, delay, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { IProgram } from '../../../core/interfaces';
import * as moment from 'moment';

@Component({
  selector: 'app-program-header',
  templateUrl: './program-header.component.html',
  styleUrls: ['./program-header.component.scss']
})
export class ProgramHeaderComponent implements OnInit, OnDestroy {

  @Input() headerComponentInput: any;
  @Output() emitTabChange = new EventEmitter<any>();

  public programDetails: any;
  public sessionContext;
  public nominationDetails;
  public mediums;
  public grades;
  activeDate;

  constructor(public toasterService: ToasterService, public resourceService: ResourceService,
     public userService: UserService, public configService: ConfigService,
     public programsService: ProgramsService) { }

  ngOnInit() {
    this.generateHeaderData();
    this.setActiveDate();
  }

  generateHeaderData() {
    this.programDetails = _.get(this.headerComponentInput, 'programDetails');
    this.mediums = _.join(this.programDetails.config['medium'], ', ');
    this.grades = _.join(this.programDetails.config['gradeLevel'], ', ');
    this.sessionContext = _.get(this.headerComponentInput, 'sessionContext');
    this.nominationDetails = _.get(this.sessionContext, 'nominationDetails');
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

      if (['null', null, undefined, 'undefined', ''].includes(this.activeDate) && isFutureDate) {
        this.activeDate = key;
      }
    });
  }

  ngOnDestroy() {
  }
}
