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
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  blogSlug:any;
  blogDetails:any;

  constructor(private router: ActivatedRoute,private appService:ServiceService,private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    this.blogSlug = this.router.snapshot.params['slug'];
    this.blogGet();
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  
  blogGet(){
    const data = {
      slug:this.blogSlug
    };
    this.appService.postData('blog/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.blogDetails = r.blog;
      this.title.setTitle(r.blog?.seo_title);
      this.meta.updateTag({
          name: 'description',
          content: r.blog?.seo_description
      });
      this.meta.updateTag({
          name: 'keywords',
          content: r.blog?.seo_keywords
      });
    },error =>{
    });
  }

}


