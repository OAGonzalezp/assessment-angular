import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {DashboardService} from './dashboard.service';
import {HttpClient} from "@angular/common/http";
import {TransactionFormService} from "../transactions/transaction-form.service";
import {TransactionsComponent} from "../transactions/transactions.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [FormBuilder, HttpClient]
})

export class DashboardComponent implements OnInit, AfterViewInit {
  loadingCards: boolean | undefined;
  page = 0;
  dialogRef: any;
  request: any;

  cardForm: FormGroup | undefined;

  displayedColumns: string[] = ['number','pan','customerName','customerId', 'type', 'actions'];
  dataTable: any = [];

  resultsLength = 0;
  isLoadingResults = true;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, public service: DashboardService,
              public dialog: MatDialog, private router: Router,public transactionService:TransactionFormService) {
    this.buildForm();

  }

  buildForm() {
    this.cardForm = new FormGroup({});
  }

  ngOnInit() {
  }

  getCards() {
    this.loadingCards = this.service.cards.length === 0;
  }

  openBottomSheet(): void {
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  openTransactionsDialog(pan: string): void {
    this.transactionService.getTransactions(pan).subscribe( data => {
      console.log(data);
      this.dialog.open(TransactionsComponent, {
        width: '650px',
        data: data.transactions,
      });
    });

  }

  search() {
      this.searchByTable();
  }

  searchByTable() {

    this.service.getCards().subscribe(data => {
      this.isLoadingResults = false;
      this.dataTable = data;
      this.dataTable.forEach((element: any, index: number) => {
        console.log(element);
        // @ts-ignore
        element.number = (index + 1);
        // @ts-ignore
//        element.format_date = moment(element.creationDate).format('MMM Do YYYY');
        // @ts-ignore
        element.color = this.getRandomColor();
      });
    });
  }


  closeDialog() {
    this.dialogRef.close();
  }


  getRandomColor(): object {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return {'background-color': color};
  }

  onLoadMenu(menu: any) {
  }

  ngAfterViewInit() {
    this.search();
  }
}
