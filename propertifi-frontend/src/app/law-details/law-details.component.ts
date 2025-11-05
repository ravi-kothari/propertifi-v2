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
  selector: 'app-law-details',
  templateUrl: './law-details.component.html',
  styleUrls: ['./law-details.component.css']
})
export class LawDetailsComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  state:any;
  pageData:any = [];
  stateName:any;
  laws:any;
  constructor(private router: ActivatedRoute,private appService:ServiceService,private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    this.state = this.router.snapshot.params['slug'];
    this.getLaw();
    this.title.setTitle('Propertifi Laws | '+this.state);
      this.meta.updateTag({
          name: 'description',
          content: 'Propertifi Laws | '+this.state
      });
      this.meta.updateTag({
          name: 'keywords',
          content: 'Propertifi Laws | '+this.state
      });
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  getLaw(){
    const data = {
      state:this.state
    };
    this.appService.postData('law/get',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.pageData = r.stateData;
      this.stateName = r.stateData.state;
      this.laws = JSON.parse(r.stateData.laws);
      console.log(this.laws);
    },error =>{
    });
  }
  

}

