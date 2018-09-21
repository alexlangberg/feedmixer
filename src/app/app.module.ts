import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeedItemsListComponent } from './feed-items-list/feed-items-list.component';
import { HttpClientModule } from '@angular/common/http';
import { Feed2jsonService } from './shared/services/feed2json/feed2json.service';
import { FeedItemsListService } from './feed-items-list/feed-items-list.service';
import { FormsModule } from '@angular/forms';

import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    FeedItemsListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    Feed2jsonService,
    FeedItemsListService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
