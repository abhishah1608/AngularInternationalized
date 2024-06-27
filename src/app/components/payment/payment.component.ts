import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControlName,
  Validators,
} from "@angular/forms";
import { BookAddedInCart } from "src/app/model/book-added-in-cart";
import { PaymentForm } from "src/app/model/payment-form";
import { PaymentService } from "src/app/services/payment.service";
import { GlobalService } from "src/app/services/global.service";
import { ReadlocalfileService } from "src/app/services/readlocalfile.service";

@Component({
  selector: "app-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.css"],
})
export class PaymentComponent implements OnInit, OnDestroy {
  bookCart: BookAddedInCart;

  paymentform: FormGroup;

  productInfo: string;

  formobj: PaymentForm;

  errorMessage = "";

  paymentserviceobj: any;

  language = "";

  externalfilestring = "";

  // tslint:disable-next-line:max-line-length
  constructor(
    public fb: FormBuilder,
    public paymentservice: PaymentService,
    private global: GlobalService,
    private fileread: ReadlocalfileService
  ) {
    const bookcart = sessionStorage.getItem("Cart");
    this.bookCart = JSON.parse(bookcart);
    sessionStorage.setItem("amount", this.bookCart.Amount.toString());
    this.productInfo = JSON.stringify(this.bookCart.detail);
  }

  ngOnInit() {
    const filepath = this.global.translatorfilepath + "paymentscreen.json";
    this.fileread.ReadFile(filepath).subscribe((content) => {
      this.externalfilestring = content;
    });
    this.language = this.global.language;

    this.paymentform = this.fb.group({
      firstName: ["", [Validators.required, Validators.maxLength(25)]],
      lastName: ["", [Validators.required, Validators.maxLength(25)]],
      email: ["", [Validators.required]],
      mobileNo: ["", [Validators.required, Validators.maxLength(10)]],
      country: ["", [Validators.required]],
      state: ["", [Validators.required]],
      city: ["", [Validators.required]],
      address1: ["", [Validators.required]],
      address2: ["", [Validators.required]],
      zipcode: ["", [Validators.required]],
    });
  }

  onSubmit(): void {
    this.errorMessage = "";
    if (this.paymentform.valid === true) {
      this.formobj = new PaymentForm();

      this.formobj.productinfo = this.productInfo;

      this.formobj.product = "book";

      this.formobj.firstName = this.paymentform.get("firstName").value;

      this.formobj.lastName = this.paymentform.get("lastName").value;

      this.formobj.email = this.paymentform.get("email").value;

      this.formobj.phone = this.paymentform.get("mobileNo").value;

      this.formobj.state = this.paymentform.get("state").value;

      this.formobj.country = this.paymentform.get("country").value;

      this.formobj.address1 = this.paymentform.get("address1").value;

      this.formobj.address2 = this.paymentform.get("address2").value;

      this.formobj.city = this.paymentform.get("city").value;

      this.formobj.zipCode = this.paymentform.get("zipcode").value;

      this.formobj.userId = +sessionStorage.getItem("UserId");

      this.formobj.loginId = +sessionStorage.getItem("sessionId");

      this.formobj.udf1 = this.global.paymenturl;

      this.paymentserviceobj = this.paymentservice
        .Generateform(this.formobj)
        .subscribe((formobj) => {
          window.location.href = formobj.StripeUrl;
        });
    } else {
      if (
        this.paymentform.get("firstName").errors &&
        this.paymentform.get("firstName").errors.required
      ) {
        this.errorMessage = "First Name is required";
      } else if (
        this.paymentform.get("lastName").errors &&
        this.paymentform.get("lastName").errors.required
      ) {
        this.errorMessage = "Last Name is required";
      } else if (
        this.paymentform.get("email").errors &&
        this.paymentform.get("email").errors.required
      ) {
        this.errorMessage = "Email is required";
      } else if (
        this.paymentform.get("mobileNo").errors &&
        this.paymentform.get("mobileNo").errors.required
      ) {
        this.errorMessage = "Mobile No is required";
      } else if (
        this.paymentform.get("country").errors &&
        this.paymentform.get("country").errors.required
      ) {
        this.errorMessage = "Country is required";
      } else if (
        this.paymentform.get("state").errors &&
        this.paymentform.get("state").errors.required
      ) {
        this.errorMessage = "State is required";
      } else if (
        this.paymentform.get("address1").errors &&
        this.paymentform.get("address1").errors.required
      ) {
        this.errorMessage = "Address 1 is required";
      } else if (
        this.paymentform.get("address2").errors &&
        this.paymentform.get("address2").errors.required
      ) {
        this.errorMessage = "Address 2 is required";
      } else if (
        this.paymentform.get("zipcode").errors &&
        this.paymentform.get("zipcode").errors.required
      ) {
        this.errorMessage = "Zipcode is required";
      }
    }
  }

  removeMessage() {
    this.errorMessage = "";
  }

  ngOnDestroy(): void {
    if (this.paymentserviceobj) {
      this.paymentserviceobj.unsubscribe();
    }
  }
}
