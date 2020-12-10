import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// NGRX Modules
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { environment } from 'src/environments/environment';

import { MediaReducer } from './reducers/media.redux';
import { Media } from '@ionic-native/media/ngx';
import { MediaPlayerEffect } from './effects/mediaplayer.effect';
import { MusicControlService } from './services/music-control.service';
import { UserReducer } from './reducers/user.redux';
import { UserEffect } from './effects/user.effects';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({
      MediaState: MediaReducer,
      UserState: UserReducer
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production}),
    EffectsModule.forRoot([MediaPlayerEffect, UserEffect])
  ],
  providers: [
    StatusBar,
    SplashScreen,
    MusicControlService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Media
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
