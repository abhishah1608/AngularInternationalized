import { Component, OnInit } from "@angular/core";
import { Book } from "src/app/model/book";
import { BookapiService } from "src/app/services/bookapi.service";
import { BookDetails } from "src/app/model/book-details";
import { BookAddedInCart } from "src/app/model/book-added-in-cart";
import { SessiontimeoutService } from "src/app/services/sessiontimeout.service";

@Component({
  selector: "app-booklist",
  templateUrl: "./booklist.component.html",
  styleUrls: ["./booklist.component.css"],
})
export class BooklistComponent implements OnInit {
  books: Book[];

  bookCart: BookAddedInCart;

  bookstring: any;

  constructor(
    private apiservice: BookapiService,
    private session: SessiontimeoutService
  ) {
    this.bookCart = new BookAddedInCart();
    if (
      sessionStorage.getItem("Cart") === undefined ||
      sessionStorage.getItem("Cart") == null
    ) {
      this.bookCart.detail = [];
      this.bookCart.Amount = 0;
    } else {
      this.bookstring = sessionStorage.getItem("Cart");
      this.bookCart = JSON.parse(this.bookstring);
    }
    // if null then init again with.
    if (this.bookCart == null) {
      this.bookCart = new BookAddedInCart();
      this.bookCart.detail = [];
      this.bookCart.Amount = 0;
    }
    this.bookCart.UserId = Number(sessionStorage.getItem("UserId"));
    this.bookCart.LoginId = Number(sessionStorage.getItem("sessionId"));
    this.onAddClick = this.onAddClick.bind(this);
    this.onRemoveClick = this.onRemoveClick.bind(this);
  }

  ngOnInit() {
    if (sessionStorage.getItem("Books")) {
      const books = sessionStorage.getItem("Books");
      this.books = JSON.parse(books);
    } else {
      this.apiservice.GetBookList().subscribe((response) => {
        this.books = response as Book[];
        this.bookstring = JSON.stringify(this.books);
        sessionStorage.setItem("Books", this.bookstring);
      });
    }
  }

  AddItemToCart(book: Book) {
    const bookdetail = this.IsBookAvailableInCart(book.BookId);

    if (bookdetail === undefined) {
      // tslint:disable-next-line:no-shadowed-variable
      const bookdetail: BookDetails = new BookDetails();
      bookdetail.BookId = book.BookId;
      bookdetail.Quantity = 1;
      bookdetail.total = book.BookPrice;
      bookdetail.BookPrice = book.BookPrice;
      bookdetail.BookName = book.BookName;
      this.bookCart.detail.push(bookdetail);
    } else {
      bookdetail.Quantity = bookdetail.Quantity + 1;
      bookdetail.total = book.BookPrice * bookdetail.Quantity;
    }
    book.stock -= 1;
    this.bookCart.Amount = this.bookCart.Amount + book.BookPrice;
    sessionStorage.setItem("Cart", JSON.stringify(this.bookCart));
    sessionStorage.setItem("Books", JSON.stringify(this.books));
  }

  IsBookAvailableInCart(bookId: number): BookDetails {
    let bookdetail: BookDetails;
    if (this.bookCart && this.bookCart.detail.length > 0) {
      bookdetail = this.bookCart.detail.find((e) => e.BookId === bookId);
    }
    return bookdetail;
  }

  RemoveItemFromCart(book: Book) {
    const bookdetail = this.IsBookAvailableInCart(book.BookId);
    if (bookdetail !== undefined) {
      bookdetail.Quantity = bookdetail.Quantity - 1;
      book.stock += 1;
      bookdetail.total = bookdetail.Quantity * book.BookPrice;
      this.bookCart.Amount = this.bookCart.Amount - book.BookPrice;
      // remove item from cart.
      if (bookdetail.Quantity === 0) {
        this.bookCart.detail = this.bookCart.detail.filter(
          (e) => e.BookId !== book.BookId
        );
      }
    }
    sessionStorage.setItem("Cart", JSON.stringify(this.bookCart));
    sessionStorage.setItem("Books", JSON.stringify(this.books));
  }

  onAddClick(e: any) {
    e.event.preventDefault();
    const b: Book = e.row.data as Book;
    this.AddItemToCart(b);
  }

  onRemoveClick(e: any) {
    e.event.preventDefault();
    const b: Book = e.row.data as Book;
    this.RemoveItemFromCart(b);
  }

  editorPreparing(e: any) {
    if (e.dataField === "Description") {
      e.editorName = "dxTextArea";
    }
  }
}
