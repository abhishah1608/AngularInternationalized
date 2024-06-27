import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { HttpHeaders, HttpClient } from "@angular/common/http";

import { BookAddedInCart } from "src/app/model/book-added-in-cart";
import { GlobalService } from "src/app/services/global.service";
import { BookDetails } from "src/app/model/book-details";
import { SendEmail } from "src/app/model/send-email";
import { PaymentInfo } from "src/app/model/payment-info";
import { PaymentService } from "src/app/services/payment.service";

@Component({
  selector: "app-payment-status",
  templateUrl: "./payment-status.component.html",
  styleUrls: ["./payment-status.component.css"],
})
export class PaymentStatusComponent implements OnInit, OnDestroy {
  CheckoutsessionId: string;

  Bookdetail: BookDetails[];

  status: string;

  amount: string;

  header: string;

  orderId: string;

  bookCart: BookAddedInCart;

  emailserviceobj: any;

  addorderserviceobj: any;

  // tslint:disable-next-line:max-line-length
  constructor(
    private route: ActivatedRoute,
    private paymentservice: PaymentService,
    private http: HttpClient,
    private global: GlobalService
  ) {}

  ngOnInit() {
    this.CheckoutsessionId = this.route.snapshot.paramMap.get("PayuMoneyId");

    this.paymentservice
      .GetPaymentStatus(this.CheckoutsessionId)
      .subscribe((data) => {
        const d = data as PaymentInfo;

        this.Bookdetail = d.details;

        this.status = d.status;

        this.amount = d.amount;

        this.orderId = d.OrderId;

        if (this.status.toLowerCase() === "success") {
          this.header =
            "Your Order placed Successfully and payment is successful with OrderId " +
            d.OrderId;
          const httpOptions = {
            headers: new HttpHeaders({
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              Accept: "application/json",
              "Access-Control-Allow-Methods": "*",
              "Access-Control-Allow-Headers": "*",
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            }),
          };
          const email: SendEmail = new SendEmail();
          email.From = "";
          email.password = "";
          email.Subject =
            "Your Order has been Successfully placed for Books from Bookstore with OrderId  " +
            d.OrderId;
          let body = sessionStorage.getItem("body");
          if (this.amount !== undefined && this.amount != null) {
            // tslint:disable-next-line:max-line-length
            body =
              "<h3 style='text-align=center'>" +
              "Order successfully placed" +
              "</h3><br>" +
              body +
              "<br><h3 style='color:blue;text-align=center'>" +
              "Amount :" +
              this.amount +
              "</h3>";
            email.body = body;
            email.To = sessionStorage.getItem("email");
            email.OrderId = d.OrderId;
            const urladdress = this.global.baseurlservice + "Email/SendEmail";

            this.emailserviceobj = this.http
              .post(urladdress, email, httpOptions)
              .subscribe((data1) => {});
            // on success add order in purchase table as successful order placed.
            const urlpath = this.global.baseurlservice + "Book/" + "AddOrder";
            const bookcart = sessionStorage.getItem("Cart");
            this.bookCart = JSON.parse(bookcart);

            // tslint:disable-next-line:variable-name
            this.addorderserviceobj = this.http
              .post(urlpath, this.bookCart, httpOptions)
              .subscribe((_data) => {});
            sessionStorage.setItem("Cart", null);
          }
        } else {
          this.header = "Your payment is failed with OrderId " + d.OrderId;
        }
      });
  }

  // to unsubscribe observables.
  ngOnDestroy(): void {
    if (this.addorderserviceobj) {
      this.addorderserviceobj.unsubscribe();
    }
    if (this.emailserviceobj) {
      this.emailserviceobj.unsubscribe();
    }
  }
}
