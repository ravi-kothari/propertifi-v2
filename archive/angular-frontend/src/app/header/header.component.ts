import { Component, OnInit,OnDestroy } from '@angular/core';
import { ServiceService } from '../service/service.service';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  pageData:any;
  topBarData:any;

  constructor(private appService:ServiceService) { }

  ngOnInit(): void {
    this.getSliderData();
    this.getTopBarData();
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  closeAnnouncement(){
    $('#topAnnouncement').slideUp();
  }
  getSliderData(){
    const data = {
      page_id:1
    };
    this.appService.postData('page/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.pageData = r.pageData;
    },error =>{
    });
  }
  getTopBarData(){
    const data = {
      page_id:4
    };
    this.appService.postData('page/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.topBarData = r.pageData;
    },error =>{
    });
  }

}
