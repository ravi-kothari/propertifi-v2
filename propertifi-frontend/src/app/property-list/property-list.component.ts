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
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit,OnDestroy {

  destroy$ = new Subject();
  state:any;
  city:any;
  cate_id = 1;
  agents:any = [];
  stateName:any ='';
  cityName:any ='';
  constructor(private router: ActivatedRoute,private appService:ServiceService,private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    this.state = this.router.snapshot.params['state'];
    this.city = this.router.snapshot.params['city'];
    this.getAgents();
    
  }
  ngOnDestroy(): void {
    this.destroy$.complete();
  }
  setCategory(id:number){
    this.agents = [];
    this.cate_id = id;
    this.getAgents();
  }
  getAgents(){
    const data = {
      cate_id:this.cate_id,
      state:this.state,
      city:this.city
    };
    this.appService.postData('agents/list',data).pipe(takeUntil(this.destroy$)).subscribe(res=>{
      var r:any=res;
      this.stateName = r.stateName;
      this.cityName = r.cityName;
      this.title.setTitle('Propertifi | '+r.stateName+' | '+r.cityName);
      this.meta.updateTag({
          name: 'description',
          content: 'Propertifi | '+r.stateName+' | '+r.cityName
      });
      this.meta.updateTag({
          name: 'keywords',
          content: 'Propertifi | '+r.stateName+' | '+r.cityName
      });
      this.agents = r.agents.data;
    },error =>{
    });
  }
  

}

