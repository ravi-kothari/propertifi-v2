import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { ServiceService } from '../service/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  pageData:any;

  constructor(private router: Router,private appService:ServiceService) { }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    localStorage.removeItem("property_category");
    localStorage.removeItem("property_address");
    localStorage.removeItem("property_city");
    localStorage.removeItem("property_zip");
    localStorage.removeItem("property_price");
    localStorage.removeItem("full_name");
    localStorage.removeItem("email_address"); 
    localStorage.removeItem("phone_no");  
    this.getPageData();
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  getPageData(){
    const data = {
      page_id:3
    };
    this.appService.postData('page/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.pageData = r.pageData;
    },error =>{
    });
  }

}



