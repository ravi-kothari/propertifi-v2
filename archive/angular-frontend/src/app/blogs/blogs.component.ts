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
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  blogs:any = [];
  blogCategories:any = [];
  pageData:any;
  blog_cate_id:number = 0;
  searchKey:any;

  constructor(private router: Router,private appService:ServiceService,private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    this.blogCategoryList();
    this.blogList();
    this.getPageData();
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  searchNow(){
    this.searchKey = $('#search_key').val();
    this.blogList();
  }
  filterBlog(id:number){
    $('.b_tab').removeClass('active');
    this.blog_cate_id =id;
    this.blogList();
    $('#b_f_'+id).addClass('active');
  }
  blogList(){
    const data = {
      type:'Page',
      blog_cate_id:this.blog_cate_id,
      search_key:this.searchKey
    };
    this.appService.postData('blogs/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.blogs = r.blogs;
    },error =>{
    });
  }
  blogCategoryList(){
    const data = {};
    this.appService.postData('blog-category/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.blogCategories = r.blogCategories;
    },error =>{
    });
  }
  getPageData(){
    const data = {
      page_id:10
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

}


