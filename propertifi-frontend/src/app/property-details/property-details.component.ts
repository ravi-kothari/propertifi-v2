import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
declare var $: any;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {from, noop, of, Subject} from 'rxjs';
import {map, mergeAll, mergeMap, takeUntil} from 'rxjs/operators';
import { ServiceService } from '../service/service.service';
import Swal from 'sweetalert2';
import { Title, Meta } from "@angular/platform-browser";

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css']
})
export class PropertyDetailsComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  state:any;
  city:any;
  cate_id = 1;
  agent_id:any;
  agentData:any;
  stateName:any='';
  cityName:any='';
  constructor(private router: ActivatedRoute,private appService:ServiceService,private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    this.state = this.router.snapshot.params['state'];
    this.city = this.router.snapshot.params['city'];
    this.agent_id = this.router.snapshot.params['id'];
    this.getAgent();
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  getAgent(){
    const data = {
      agent_id:this.agent_id,
      state:this.state,
      city:this.city
    };
    this.appService.postData('agent/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.stateName = r.stateName;
      this.cityName = r.cityName;
      this.agentData = r.agent_data;
      this.title.setTitle(r.agent_data?.seo_title);
      this.meta.updateTag({
          name: 'description',
          content: r.agent_data?.seo_description
      });
      this.meta.updateTag({
          name: 'keywords',
          content: r.agent_data?.seo_keywords
      });
    },error =>{
    });
  }
  submit(){
    $('#submitBtn2').html('Processing...');
    const data = {
      name:$('#name').val(),
      email:$('#email').val(),
      mobile:$('#mobile').val(),
      message:$('#message').val(),
      agent_id:this.agent_id
    };
    this.appService.postData('contact/save',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      if(r.success){
        Swal.fire(
          'Success!',
          r.message,
          'success'
        );
        $('#submitBtn2').html('Submit');
        $('#name').val('');
        $('#email').val('');
        $('#mobile').val('');
        $('#message').val('');
      }else{
        Swal.fire(
          'Error!',
          r.message,
          'error'
        );
        $('#submitBtn2').html('Submit');
      }
    },error =>{
    });
  }
  

}

