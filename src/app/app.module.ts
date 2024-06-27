import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatDialogConfig, MatDialogModule } from "@angular/material";
import { DxDataGridModule } from "devextreme-angular";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { ConfirmdialogComponent } from "./components/confirmdialog/confirmdialog.component";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { LanguageTranslatorPipe } from "./pipes/language-translator.pipe";
import { AlphabetonlyDirective } from "./directives/alphabetonly.directive";
import { NumberonlyDirective } from "./directives/numberonly.directive";
import { EmailValidationDirective } from "./directives/email-validation.directive";
import { BooklistComponent } from "./components/booklist/booklist.component";
import { NgIdleModule } from "@ng-idle/core";
import { NgIdleKeepaliveModule } from "@ng-idle/keepalive";
import { ModalpopupComponent } from "./components/modalpopup/modalpopup.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { jqxGridComponent } from "jqwidgets-scripts/jqwidgets-ts/angular_jqxgrid";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PaymentComponent } from "./components/payment/payment.component";
import { PaymentStatusComponent } from "./components/payment-status/payment-status.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { LogoutComponent } from "./components/logout/logout.component";
import { HistoryComponent } from "./components/history/history.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { CartItemComponent } from "./components/cart-item/cart-item.component";
import { AuthGuardService } from "./services/auth-guard.service";

const appRoutes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "app",
    component: NavbarComponent,
    canActivateChild: [AuthGuardService],
    children: [
      {
        path: "booklist",
        component: BooklistComponent,
      },
      {
        path: "Cart",
        component: CartItemComponent,
      },
      {
        path: "payment",
        component: PaymentComponent,
      },
      {
        path: "paymentStatus/:PayuMoneyId",
        component: PaymentStatusComponent,
      },
      {
        path: "CartHistory",
        component: HistoryComponent,
      },
    ],
  },
  { path: "logout", component: LogoutComponent },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConfirmdialogComponent,
    LanguageTranslatorPipe,
    AlphabetonlyDirective,
    NumberonlyDirective,
    EmailValidationDirective,
    BooklistComponent,
    ModalpopupComponent,
    jqxGridComponent,
    PaymentComponent,
    PaymentStatusComponent,
    NavbarComponent,
    LogoutComponent,
    HistoryComponent,
    PageNotFoundComponent,
    CartItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    NgIdleModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    NgbModule.forRoot(),
    DxDataGridModule,
    BrowserAnimationsModule,
  ],
  providers: [MatDialogConfig],
  entryComponents: [ConfirmdialogComponent, ModalpopupComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
