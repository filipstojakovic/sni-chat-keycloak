import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {initializeKeycloak} from './auth/initKeycloak';
import {HomeComponent} from './page/home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChatRoomComponent} from './page/chat-room/chat-room.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StompServiceService} from './stomp-service.service';
import {CryptoService} from './service/crypto.service';
import {UserService} from './service/user.service';
import {MaterialModule} from '../material.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChatRoomComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    KeycloakAngularModule,
    HttpClientModule,
    MaterialModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    StompServiceService,
    CryptoService,
    UserService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
