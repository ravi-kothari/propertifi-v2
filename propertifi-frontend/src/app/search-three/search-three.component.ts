import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { ServiceService } from '../service/service.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-search-three',
  templateUrl: './search-three.component.html',
  styleUrls: ['./search-three.component.css']
})
export class SearchThreeComponent implements OnInit {

  destroy$ = new Subject();
  pageData:any;
  questions:any = [];
  page = 1;
  questionIndex = 0;
  question:any;
  questionType:any;
  option_1:any;
  option_2:any;
  option_3:any;
  option_4:any;
  option_5:any;
  option_6:any;
  content_heading:any;
  content_description:any;
  examQuestions:any = [];
  total = 0;
  multipleAnswer:any = [];

  constructor(private router: Router,private appService:ServiceService) { }

  ngOnInit(): void {
    localStorage.setItem('property_price','300');
    this.getPageData();
    this.questionList();
  }

  selectPrice(counter:any){
    this.examQuestions[counter].answer = $('#dropdown_'+counter).val();
  }
  saveNext(){
    localStorage.setItem('question_answer',JSON.stringify(this.examQuestions));
    this.router.navigateByUrl('/search-four');
  }
  selectMulti(event:any,answer:any,counter:any,position:any){
    if(typeof this.multipleAnswer[counter] == 'undefined'){
      this.multipleAnswer[counter] = [];
    }
    if(event.target.checked){
      this.multipleAnswer[counter].push(answer);
    }else{
      const index = this.multipleAnswer[counter].indexOf(answer);
      if(index > -1){
        this.multipleAnswer[counter].splice(index,1);
      }
    }
    this.examQuestions[counter].answer = this.multipleAnswer[counter];
  } 
  
  
  questionList(){
    const data = {
      type:localStorage.getItem("property_category")
    };
    this.appService.postData('question/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.questions = r.questions;
      this.content_heading = this.questions[this.questionIndex].content_heading; 
      this.content_description = this.questions[this.questionIndex].content_description; 
      this.total = this.questions.length;
      this.examQuestions = [];
      this.questions.forEach(role => this.examQuestions.push({question:role.question,answer:''}));
    
    },error =>{
    });
  }
  getPageData(){
    const data = {
      page_id:7
    };
    this.appService.postData('page/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.pageData = r.pageData;
    },error =>{
    });
  }
  saveLead(){
    var nitam = 0;
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
        price:'',
        exam:this.examQuestions
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
    
  }
 

}

function obj(obj: any, arg1: (value: any, key: any) => void) {
  throw new Error('Function not implemented.');
}

