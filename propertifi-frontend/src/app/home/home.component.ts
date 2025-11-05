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
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  blogs:any = [];
  states:any = [];
  cities:any = [];
  testimonials:any = [];
  selectedState = 'al';
  pageData:any;
  homePageData:any;
  loader = true;
  testimonialData:any;
  currentTestimonialId:number;
  stateLength:any;
  cityLength:any;
  stateID:any;
  stateAbrivation:any;

  constructor(private router: Router,private appService:ServiceService,private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    localStorage.removeItem("property_category");
    localStorage.removeItem("property_address");
    localStorage.removeItem("property_city");
    localStorage.removeItem("property_zip");
    localStorage.removeItem("property_price");
    localStorage.removeItem("full_name");
    localStorage.removeItem("email_address");  
    localStorage.removeItem("phone_no");  
    this.getHomeData();
    this.getAboutData();
    this.stateList('Half');
    this.testimonialList();
    this.blogList();
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  saveZip(){
    localStorage.setItem('property_zip',$('#zipcode').val());
    this.router.navigateByUrl('/search');
  }
  getReview(id:number){
    const data = {
      id:id
    };
    this.appService.postData('testimonial/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.testimonialData = r.testimonial;
      this.currentTestimonialId = id;
    },error =>{
    });
  }
  loadNewTestimonial(id:number){
    this.getReview(id);
  }
  getAboutData(){
    const data = {
      page_id:2
    };
    this.appService.postData('page/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.pageData = r.pageData;
    },error =>{
    });
  }
  getHomeData(){
    const data = {
      page_id:1
    };
    this.appService.postData('page/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.homePageData = r.pageData;
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
  testimonialList(){
    const data = {
      type:'Featured'
    };
    this.appService.postData('testimonial/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.testimonials = r.testimonials;
      setTimeout(() => {
        $('.test-carousel').owlCarousel({
          loop:true,
          margin:30,
          autoplay:true,
          nav:false,
          dots:false,
          responsive:{
          0:{
            items:1
        },
        600:{
            items:2
        },
        1000:{
            items:3
        }
      }
      });
      }, 2000);
      
    },error =>{
    });
  }
  blogList(){
    const data = {
      type:'Featured'
    };
    this.appService.postData('blogs/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.blogs = r.blogs;
    },error =>{
    });
  }
  stateList(type:any){
    $('#view_all_state').html('Loading...');
    const data = {
      type:'Featured',
      length:type
    };
    this.appService.postData('state/code/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.states = r.states;
      this.stateLength = r.length;
      this.loader = false;
      this.stateID = r.first_state.id;
      this.stateAbrivation = r.first_state.abbreviation;
      $('#view_all_state').html('View All States');
      this.cityList(r.first_state.id,r.first_state.abbreviation,'Half');
    },error =>{
    });
  }
  cityList(state_id,selected_state,type){
    $('#view_all_city').html('Loading...');
    this.stateID = state_id;
    this.stateAbrivation = selected_state;
    $('#no-city-div').html('Loading...');
    this.selectedState = selected_state;
    $('.common-state-class').removeClass('state-active');
    $('#state_'+state_id).addClass('state-active');
    const data = {
      state_id:state_id,
      length:type
    };
    this.appService.postData('city/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.cities = r.cities;
      this.cityLength = r.length;
      $('#view_all_city').html('View All Cities');
      if(r.count == 0){
        $('#no-city-div').html('No cities available in '+selected_state);
      }
    },error =>{
    });
  }
  seeAllCity(){
    this.cityList(this.stateID,this.stateAbrivation,'Full');
  }

}

