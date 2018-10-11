import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeedComponent } from './feed/feed.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidenavComponent } from './sidenav/sidenav.component';

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule, MatListModule,
  MatPaginatorModule, MatRadioModule, MatSelectModule,
  MatSidenavModule, MatSlideToggleModule,
  MatTableModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { SearchComponent } from './search/search.component';
import { FeedsSelectorComponent } from './feeds-selector/feeds-selector.component';
import { TopTermsComponent } from './top-terms/top-terms.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { SidenavEndComponent } from './sidenav-end/sidenav-end.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    SidenavComponent,
    SearchComponent,
    FeedsSelectorComponent,
    TopTermsComponent,
    NavigationComponent,
    SidenavEndComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTabsModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatBadgeModule,
    MatAutocompleteModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
