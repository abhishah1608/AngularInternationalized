import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, of } from "rxjs";

import { GlobalService } from "./global.service";
import { LoginModel } from "../model/login-model";
import { UserDetail } from "../model/user-detail";
import { UserAddClass } from "../model/user-add-class";
import { ConfirmdialogComponent } from "../components/confirmdialog/confirmdialog.component";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  url: string;

  // tslint:disable-next-line:max-line-length
  constructor(
    private httpclient: HttpClient,
    private global: GlobalService,
    private dialog: MatDialog,
    private config: MatDialogConfig,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.url = this.global.baseurlservice + "Login/";
  }

  IsuserAllowTologgedIn(login: LoginModel): Observable<boolean> {
    let bRetval = false;
    const urlpath = this.url + "IsUserloggedIn";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      }),
    };
    this.httpclient.post(urlpath, login, httpOptions).subscribe((data) => {
      const userdetail: UserDetail = new UserDetail();
      userdetail.username = login.username;
      userdetail.password = login.password;
      userdetail.Signup = 0;
      userdetail.browser = "";
      bRetval = true;
      if (data.toString() === "1") {
        return this.AddUser(userdetail);
      } else if (data.toString() === "-1") {
        bRetval = false;
        const msg = {
          message: "Please Enter Correct username and password",
          okbutton: true,
        };
        this.config.data = msg;
        this.config.width = "400px";
        this.config.height = "250px";

        this.dialog.open(ConfirmdialogComponent, this.config);
        return bRetval;
      } else {
        const msg = {
          message:
            "User already logged in from another location, Are you sure you want to login",
          okbutton: false,
        };
        this.config.data = msg;
        this.config.width = "600px";
        this.config.height = "350px";

        this.dialog
          .open(ConfirmdialogComponent, this.config)
          .afterClosed()
          .subscribe((value) => {
            if (value.response === "1") {
              this.AddUser(userdetail);
              bRetval = true;
            } else if (value.response === "0") {
              // this will be hear.
              bRetval = false;
            }
          });
        return of(bRetval);
      }
    });
    return of(bRetval);
  }

  AddUser(userdetail: UserDetail): Observable<boolean> {
    let bRetval = false;
    const urlpath = this.url + "AddUser";
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      }),
    };

    this.httpclient.post(urlpath, userdetail, httpOptions).subscribe((data) => {
      const useraddclass: UserAddClass = data as UserAddClass;
      if (useraddclass.UserId > 0) {
        sessionStorage.setItem("sessionId", useraddclass.LoginId.toString());
        sessionStorage.setItem("UserId", useraddclass.UserId.toString());
        sessionStorage.setItem("email", useraddclass.emailId);
        sessionStorage.setItem("token", useraddclass.seckey);
        this.router.navigate(["/app/booklist"], { relativeTo: this.route });
        bRetval = true;
      } else {
        if (userdetail.Signup === 1) {
          const msg = {
            message:
              "Account already created with this username try to create with different username",
            okbutton: true,
          };
          this.config.data = msg;
          this.config.width = "600px";
          this.config.height = "200px";
          this.dialog.open(ConfirmdialogComponent, this.config);
        } else {
          const msg = {
            message: "please enter correct username and password",
            okbutton: true,
          };
          this.config.data = msg;
          this.config.width = "600px";
          this.config.height = "200px";
          this.dialog.open(ConfirmdialogComponent, this.config);
        }
      }
    });
    return of(bRetval);
  }

  logout(): Observable<boolean> {
    let bRetval = false;
    const urlpath =
      this.url +
      "LogoutService" +
      "?" +
      "loginId=" +
      sessionStorage.getItem("sessionId");
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
      }),
    };

    this.httpclient.post(urlpath, null, httpOptions).subscribe((data) => {
      if (data.toString() === "1") {
        sessionStorage.clear();
        this.router.navigate(["/app/userprofile"], { relativeTo: this.route });
        bRetval = true;
        this.router.navigate(["../login"]);
      }
    });
    return of(bRetval);
  }
}
