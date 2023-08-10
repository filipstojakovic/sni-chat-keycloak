import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {KeycloakAngularModule, KeycloakService} from 'keycloak-angular';
import {initializeKeycloak} from './auth/initKeycloak';
import {HomeComponent} from './page/home/home.component';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SocketService} from './socket.service';
import {UserService} from './service/user.service';
import {MaterialModule} from '../material.module';
import {ToolbarComponent} from './component/toolbar/toolbar.component';
import {MessageService} from './service/message.service';
import {UtilService} from './service/util.service';
import {StegeService} from './service/stege.service';
import {SymmetricService} from './service/symmetric.service';
import {AsymmetricService} from './service/asymmetric.service';
import {CookieService} from "ngx-cookie-service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ToolbarComponent,
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
    CookieService,
    SocketService,
    UserService,
    MessageService,
    UtilService,
    StegeService,
    SymmetricService,
    AsymmetricService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
