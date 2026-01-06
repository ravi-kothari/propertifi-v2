import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { ServiceService } from '../service/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up-popup',
  templateUrl: './sign-up-popup.component.html',
  styleUrls: ['./sign-up-popup.component.css']
})
export class SignUpPopupComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  full_name = localStorage.getItem('full_name');
  email_address = localStorage.getItem('email_address');
  pRange:any = 100;

  constructor(private router: Router,private appService:ServiceService) { }

  ngOnInit(): void {
    
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }

  register(){
      $('#registerBtn').html('Processing...');
      const data = {
        company_name:$('#s_company_name').val(),
        email:$('#s_email_address').val(),
        mobile:$('#s_mobile_no').val(),
        country_code:$('#country_code').val(),
      };
        this.appService.postData('agent/save',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
          var r:any=res;
          if(r.success){
            $('#s_company_name').val('');
            $('#s_email_address').val('');
            $('#s_mobile_no').val('');
            $('#country_code').val(1);
            $('#registerBtn').html('Submit');
            
            $('#signupModal').hide();
            $('.modal-backdrop').remove();
            $('#registerBtn').html('Submit');
            Swal.fire(
              'Success!',
              r.message,
              'success'
            ); 
          }else{
            
            Swal.fire(
              'Error!',
              r.message,
              'error'
            );
            $('#registerBtn').html('Submit');
          }
        },error =>{
        });
   
    
  }

}


