import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FeedComponent } from './feed/feed.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { SearchComponent } from './shared/components/search/search.component';
import { FeedSelectorComponent } from './shared/components/feed-selector/feed-selector.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { SidenavEndComponent } from './navigation/sidenav-end/sidenav-end.component';
import { SettingsComponent } from './shared/components/settings/settings.component';
import { FeedItemInfoComponent } from './shared/components/feed-item-info/feed-item-info.component';
import { RedditUrlLookupComponent } from './shared/components/reddit-url-lookup/reddit-url-lookup.component';
import { FeedItemTermsSearchComponent } from './shared/components/feed-item-terms-search/feed-item-terms-search.component';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import {
  MatAutocompleteModule, MatBadgeModule,
  MatButtonModule,
  MatChipsModule, MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule, MatListModule,
  MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTableModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import { SettingsState } from './shared/state/settings.state';
import { FeedsState } from './shared/state/feeds.state';
import { SearchState } from './shared/state/search.state';
import { UiState } from './shared/state/ui.state';
import { SearchAdvancedEditComponent } from './shared/components/search-advanced-edit/search-advanced-edit.component';
import {
  SearchAdvancedEditConfirmOverwriteDialogComponent
} from './shared/components/search-advanced-edit/search-advanced-edit-confirm-overwrite.dialog';
import { SearchAdvancedDisplayComponent } from './shared/components/search-advanced-display/search-advanced-display.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    SidenavComponent,
    SearchComponent,
    FeedSelectorComponent,
    NavigationComponent,
    SidenavEndComponent,
    SettingsComponent,
    FeedItemInfoComponent,
    RedditUrlLookupComponent,
    FeedItemTermsSearchComponent,
    SearchAdvancedEditComponent,
    SearchAdvancedEditConfirmOverwriteDialogComponent,
    SearchAdvancedDisplayComponent
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
    MatToolbarModule,
    MatSidenavModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatDividerModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    NgxsModule.forRoot([
      SettingsState,
      FeedsState,
      SearchState,
      UiState
    ])
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [SearchAdvancedEditConfirmOverwriteDialogComponent]
})
export class AppModule { }
