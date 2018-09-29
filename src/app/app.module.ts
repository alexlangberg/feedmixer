import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeedItemsListComponent } from './feed-items-list/feed-items-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FeedItemsListService } from './feed-items-list/feed-items-list.service';
import { FormsModule } from '@angular/forms';
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
import { ToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedItemsListComponent,
    SidenavComponent,
    ToolbarComponent
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
    FormsModule
  ],
  providers: [
    FeedItemsListService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
