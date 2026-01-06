import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { ServiceService } from '../service/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  blogs:any = [];

  constructor(private router: Router,private appService:ServiceService) { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  saveNewsletter(){
    var nitam = 0;
    if($('#newsletter_email').val() ==''){
      Swal.fire(
        'Error!',
        'Please enter email address.',
        'error'
      );
      nitam = 1; return false;
    }
    if(nitam == 0){
      $('#submitBtn').html('Processing...');
      const data = {
        email_address:$('#newsletter_email').val()
      };
        this.appService.postData('newsletter/save',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
          var r:any=res;
          if(r.success){
            Swal.fire(
              'Success!',
              r.message,
              'success'
            );
            $('#submitBtn').html('Submit');
            $('#newsletter_email').val('');
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


