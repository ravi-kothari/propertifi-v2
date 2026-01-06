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
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  faqs:any = [];
  loading = true;
  pageData:any;

  constructor(private router: Router,private appService:ServiceService,private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    this.faqList();
    this.getPageData();
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  getPageData(){
    const data = {
      page_id:9
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
  faqList(){
    const data = {
      type:'Featured'
    };
    this.appService.postData('faq/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.faqs = r.faqs;
      this.loading = false;
    },error =>{
    });
  }

}


