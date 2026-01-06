import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { SearchTwoComponent } from './search-two/search-two.component';
import { SearchThreeComponent } from './search-three/search-three.component';
import { SearchFourComponent } from './search-four/search-four.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ResourcesComponent } from './resources/resources.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogComponent } from './blog/blog.component';
import { FaqsComponent } from './faqs/faqs.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AcceptableUsePolicyComponent } from './acceptable-use-policy/acceptable-use-policy.component';
import { LimitedUseDisclosureComponent } from './limited-use-disclosure/limited-use-disclosure.component';
import { CarrersComponent } from './carrers/carrers.component';
import { OurMissionComponent } from './our-mission/our-mission.component';
import { MyClientCenterComponent } from './my-client-center/my-client-center.component';
import { ResourceCenterComponent } from './resource-center/resource-center.component';
import { PropertyManagementComponent } from './property-management/property-management.component';
import { LawsComponent } from './laws/laws.component';
import { LawDetailsComponent } from './law-details/law-details.component';
import { SearchFiveComponent } from './search-five/search-five.component';

const routes: Routes = [
  {
    path:'',component:HomeComponent
  },
  {
    path:'contact-us',component:ContactUsComponent
  },
  {
    path:'privacy-policy',component:PrivacyPolicyComponent
  },
  {
    path:'my-client-center',component:MyClientCenterComponent
  },
  {
    path:'resource-center',component:ResourceCenterComponent
  },
  {
    path:'acceptable-use-policy',component:AcceptableUsePolicyComponent
  },
  {
    path:'property-management',component:PropertyManagementComponent
  },
  {
    path:'career',component:CarrersComponent
  },
  {
    path:'our-mission',component:OurMissionComponent
  },
  {
    path:'limited-use-disclosure',component:LimitedUseDisclosureComponent
  },
  {
    path:'search',component:SearchComponent
  },
  {
    path:'search-two',component:SearchTwoComponent
  },
  {
    path:'search-three',component:SearchThreeComponent
  },
  {
    path:'search-four',component:SearchFourComponent
  },
  {
    path:'agents/:state/:city',component:PropertyListComponent
  },
  {
    path:'agent/:state/:city/:id',component:PropertyDetailsComponent
  },
  {
    path:'thank-you',component:ThankYouComponent
  },
  {
    path:'about-us',component:AboutUsComponent
  },
  {
    path:'resources',component:ResourcesComponent
  },
  {
    path:'blogs',component:BlogsComponent
  },
  {
    path:'blog/:slug',component:BlogComponent
  },
  {
    path:'faqs',component:FaqsComponent
  },
  {
    path:'laws',component:LawsComponent
  },
  {
    path:'law/:slug',component:LawDetailsComponent
  },
  {
    path:'preview',component:SearchFiveComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
