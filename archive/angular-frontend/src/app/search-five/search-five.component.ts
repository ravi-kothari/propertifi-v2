import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { ServiceService } from '../service/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-search-five',
  templateUrl: './search-five.component.html',
  styleUrls: ['./search-five.component.css']
})
export class SearchFiveComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  
  pRange:any = 100;
  pageData:any;
  questions:any = [];
  total = 0;

  property_type = localStorage.getItem('property_category');
  address = localStorage.getItem('property_address');
  city = localStorage.getItem('property_city');
  zip = localStorage.getItem('property_zip');
  full_name = localStorage.getItem('full_name');
  email_address = localStorage.getItem('email_address');
  phone_no = localStorage.getItem('phone_no');
  preferred_contact_method = localStorage.getItem('preferred_contact_method');
  question_answer = JSON.parse(localStorage.getItem('question_answer'));
  p_type = '';
  constructor(private router: Router,private appService:ServiceService) { }

  ngOnInit(): void {
    this.getPageData();
    this.questionList();
    if(this.property_type == '1'){
      this.p_type = 'Single Family';
    }
    if(this.property_type == '2'){
      this.p_type = ' Multi Family';
    }
    if(this.property_type == '3'){
      this.p_type = 'Association';
    }
    if(this.property_type == '8'){
      this.p_type = 'Commercial';
    }
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  saveNext(){
    $('#submitBtn').html('Processing...');
      const data = {
        property_category:localStorage.getItem("property_category"),
        property_address:localStorage.getItem("property_address"),
        property_city:localStorage.getItem("property_city"),
        property_zip:localStorage.getItem("property_zip"),
        property_price:'',
        full_name:localStorage.getItem("full_name"),
        email_address:localStorage.getItem("email_address"),
        property_number:localStorage.getItem("phone_no"),
        preferred_contact_method:localStorage.getItem("preferred_contact_method"),
        price:'',
        exam:this.question_answer
      };
        this.appService.postData('lead/save',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
          var r:any=res;
          if(r.success){
            /* Swal.fire(
              'Success!',
              r.message,
              'success'
            ); */
            
            this.router.navigateByUrl('/thank-you');
          }else{
            Swal.fire(
              'Error!',
              r.message,
              'error'
            );
            $('#submitBtn').html('Submit');
          }
        },error =>{
        });
    
  }
  showValue(){
    var priceRang = $('#myRange').val();
    this.pRange = priceRang;
    $('#demo').html('$'+priceRang);
  }
  getPageData(){
    const data = {
      page_id:8
    };
    this.appService.postData('page/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.pageData = r.pageData;
    },error =>{
    });
  }
  questionList(){
    const data = {
      type:localStorage.getItem("property_category")
    };
    this.appService.postData('question/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.questions = r.questions;
      this.total = this.questions.length;
    },error =>{
    });
  }
  saveLead(){
    var nitam = 0;
    if($('#phone_number').val() ==''){
      Swal.fire(
        'Error!',
        'Please enter phone number.',
        'error'
      );
      nitam = 1; return false;
    }
    if(nitam == 0){
      $('#submitBtn').html('Processing...');
      const data = {
        property_category:localStorage.getItem("property_category"),
        property_address:localStorage.getItem("property_address"),
        property_city:localStorage.getItem("property_city"),
        property_zip:localStorage.getItem("property_zip"),
        property_price:'',
        full_name:localStorage.getItem("full_name"),
        email_address:localStorage.getItem("email_address"),
        property_number:localStorage.getItem("phone_no"),
        price:''
      };
        this.appService.postData('lead/save',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
          var r:any=res;
          if(r.success){
            /* Swal.fire(
              'Success!',
              r.message,
              'success'
            ); */
            $('#submitBtn').html('Submit');
            $('#closeBtn').trigger('click');
            $('.modal-backdrop').remove();
            this.router.navigateByUrl('/thank-you');
          }else{
            Swal.fire(
              'Error!',
              r.message,
              'error'
            );
            $('#submitBtn').html('Submit');
          }
        },error =>{
        });
    }
    
  }

}


