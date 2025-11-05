import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { ServiceService } from '../service/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-two',
  templateUrl: './search-two.component.html',
  styleUrls: ['./search-two.component.css']
})
export class SearchTwoComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  pageData:any;
  address = localStorage.getItem('property_address');
  city = localStorage.getItem('property_city');
  zip = localStorage.getItem('property_zip');

  constructor(private router: Router,private appService:ServiceService) { }

  ngOnInit(): void {
    this.getPageData();
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  getPageData(){
    const data = {
      page_id:6
    };
    this.appService.postData('page/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.pageData = r.pageData;
    },error =>{
    });
  }
  saveNext(){
    var nitam = 0;
    if($('#address').val() ==''){
      Swal.fire(
        'Error!',
        'Please enter address.',
        'error'
      );
      nitam = 1; return false;
    }
    if($('#city').val() ==''){
      Swal.fire(
        'Error!',
        'Please enter city.',
        'error'
      );
      nitam = 1;return false;
    }
    if($('#zip').val() ==''){
      Swal.fire(
        'Error!',
        'Please enter zip.',
        'error'
      );
      nitam = 1;return false;
    }
    if(nitam == 0){
      localStorage.setItem('property_address',$('#address').val());
      localStorage.setItem('property_city',$('#city').val());
      localStorage.setItem('property_zip',$('#zip').val());
      this.router.navigateByUrl('/search-three');
    }
    
  }

}




