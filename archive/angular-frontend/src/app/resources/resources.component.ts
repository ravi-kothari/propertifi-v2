import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { ServiceService } from '../service/service.service';
import Swal from 'sweetalert2';
import { Title, Meta } from "@angular/platform-browser";

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  selectedState = 'al';
  states:any = [];
  cities:any = [];
  pageData:any;
  loader = true;

  constructor(private router: Router,private appService:ServiceService,private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    localStorage.removeItem("property_category");
    localStorage.removeItem("property_address");
    localStorage.removeItem("property_city");
    localStorage.removeItem("property_zip");
    localStorage.removeItem("property_price");
    localStorage.removeItem("full_name");
    localStorage.removeItem("email_address"); 
    this.stateList();
    this.getPageData();
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  getPageData(){
    const data = {
      page_id:11
    };
    this.appService.postData('page/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.pageData = r.pageData;
      this.title.setTitle(r.pageData?.seo_title);
      this.meta.updateTag({
          name: 'description',
          content: r.pageData?.seo_description
      });
      this.meta.updateTag({
          name: 'keywords',
          content: r.pageData?.seo_keywords
      });
    },error =>{
    });
  }
  stateList(){
    const data = {
      type:'Full',
      length:'Full'
    };
    this.appService.postData('state/code/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.states = r.states;
      this.loader = false;
      this.cityList(r.first_state.id,r.first_state.abbreviation);
    },error =>{
    });
  }
  cityList(state_id,selected_state){
    $('#no-city-div').html('Loading...');
    this.selectedState = selected_state;
    $('.common-state-class').removeClass('state-active');
    $('#state_'+state_id).addClass('state-active');
    const data = {
      state_id:state_id,
      length:'Full'
    };
    this.appService.postData('city/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.cities = r.cities;
      if(r.count == 0){
        $('#no-city-div').html('No cities available in '+selected_state);
      }
    },error =>{
    });
  }
}

