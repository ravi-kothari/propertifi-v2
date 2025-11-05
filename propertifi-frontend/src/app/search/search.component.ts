import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { ServiceService } from '../service/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  pageData:any;

  constructor(private router: Router,private appService:ServiceService) { }

  ngOnInit(): void {
    localStorage.setItem('property_category','1');
    this.getPageData();
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  selectCategory(type:any,id:any){
    /* $('.p-category').removeClass('selected'); 
    $('#'+type).addClass('selected');  */
    //$(".radio-btn").prop("checked", false);
    $("input:radio").removeAttr("checked");
    $("#"+type).prop("checked", true);
    localStorage.setItem('property_category',id);
  } 
  getPageData(){
    const data = {
      page_id:5
    };
    this.appService.postData('page/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.pageData = r.pageData;
    },error =>{
    });
  }

}



