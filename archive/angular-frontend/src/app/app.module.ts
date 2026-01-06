import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { SearchTwoComponent } from './search-two/search-two.component';
import { SearchThreeComponent } from './search-three/search-three.component';
import { SearchFourComponent } from './search-four/search-four.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { ThankYouComponent } from './thank-you/thank-you.component';
import { HeaderSmallComponent } from './header-small/header-small.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ResourcesComponent } from './resources/resources.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogComponent } from './blog/blog.component';
import { FaqsComponent } from './faqs/faqs.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { SignUpPopupComponent } from './sign-up-popup/sign-up-popup.component';
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
import { HeaderDetailsComponent } from './header-details/header-details.component';
import { SearchFiveComponent } from './search-five/search-five.component';
import { FooterTopComponent } from './footer-top/footer-top.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    SearchComponent,
    SearchTwoComponent,
    SearchThreeComponent,
    SearchFourComponent,
    PropertyListComponent,
    PropertyDetailsComponent,
    ThankYouComponent,
    HeaderSmallComponent,
    AboutUsComponent,
    ResourcesComponent,
    BlogsComponent,
    BlogComponent,
    FaqsComponent,
    NewsletterComponent,
    SignUpPopupComponent,
    ContactUsComponent,
    PrivacyPolicyComponent,
    AcceptableUsePolicyComponent,
    LimitedUseDisclosureComponent,
    CarrersComponent,
    OurMissionComponent,
    MyClientCenterComponent,
    ResourceCenterComponent,
    PropertyManagementComponent,
    LawsComponent,
    LawDetailsComponent,
    HeaderDetailsComponent,
    SearchFiveComponent,
    FooterTopComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
