import {AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MediaMatcher} from '@angular/cdk/layout';
import {BehaviorSubject, merge, Observable, of, Subscription} from 'rxjs';
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Router} from '@angular/router';
import {BaseComponent} from '../utils/base.component.';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {BaseResponse} from '../../models/base-response.model';
import {DashboardService} from './dashboard.service';
import {HttpClient} from "@angular/common/http";
import {CardFormComponent} from "../card-form/card-form.component";
import {CardData} from "../../models/card-data.model";
import {TransactionData} from "../../models/transaction-data.model";
import {TransactionFormComponent} from "../transaction-form/transaction-form.component";
import {TransactionFormService} from "../transaction-form/transaction-form.service";
import {TransactionsComponent} from "../transactions/transactions.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [FormBuilder, HttpClient]
})

export class DashboardComponent implements OnInit, AfterViewInit {
  selectedCard: CardData | undefined;
  selectedTransaction: TransactionData | undefined;
  loadingCards: boolean | undefined;
  updatingCard: boolean | undefined;
  creatingNewCard: boolean | undefined;
  deletingCard = false;
  page = 0;
  dialogRef: any;
  request: any;

  cardForm: FormGroup | undefined;

  displayedColumns: string[] = ['number','pan','customerName','customerId', 'type', 'actions'];
  dataTable: any = [];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

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

  selectCard(card: any) {
    this.selectedCard = card;

    if (this.selectedCard!.id != null) {
      this.creatingNewCard = false;
    }
  }

  selectCardByDelete(card: any) {
    this.selectedCard = card;
    this.deletingCard = true;
    this.selectCard(card);
    this.openBottomSheet();
  }

  selectCardByUpdate(card: any) {
    this.selectedCard = card;
    this.updatingCard = true;
    this.selectCard(card);
  }

  selectNewtCard() {
    this.selectedCard = {customerId: "", customerName: "", customerPhone: "", id: 0, pan: "", type: ""};
    this.creatingNewCard = true;

    this.openDialog();
  }

  selectNewtTransaction(hash:string) {
    this.selectedTransaction={buyAddress: "", buyAmount: 0, hashIdentifier: hash, referenceNumber: "", status: ""};
    console.log(this.selectedTransaction);
    this.openNewTransactionDialog();
  }

  updateCard() {
    if (this.selectedCard != null) {
      this.request = this.service.editCard(this.selectedCard)
        .subscribe(res => {
          //this.closeDialog();
          if (res.code !== 1) {
            this.service.cardsError = true;
            this.openSnackBar('No se pudo actualizar el registro', 'Actualizar');
          } else {
            this.selectedCard = res.data;
            this.openSnackBar('Registro Actualizado', 'Actualizar');
            this.search();
            this.updatingCard = false;
          }
        }, (err) => {
          //this.closeDialog();
          this.openSnackBar('Ocurrio un error', 'Actualizar');
          this.service.isLoadingCards = false;
          this.service.cardsError = true;
          console.log(err);
        });
    }
  }

  saveCard() {
    if (this.selectedCard != null) {
      this.service.createCard(this.selectedCard)
        .subscribe(res => {
          //this.closeDialog();
          if (res.code !== "00") {
            this.service.cardsError = true;
            this.openSnackBar('ERROR: ' + res.message, 'Guardar');
          } else {
            this.selectedCard = undefined;
            this.creatingNewCard = false;
            this.openSnackBar('Usuario guardado', 'Guardar');
            this.search();
            this.updatingCard = false;
          }
        }, (err) => {
          //this.closeDialog();
          console.log(err);
          this.openSnackBar('Ocurrio un error: ' + err.error.message, 'Guardar');
          this.service.isLoadingCards = false;
          this.service.cardsError = true;
          console.log(err);
        });

    }
  }

  deleteCard() {
    this.service.deleteCard(this.selectedCard)
      .subscribe(res => {
        //this.closeDialog();
        if (res.code !== 1) {
          this.service.cardsError = true;
          this.openSnackBar('No se pudo borrar el card', 'Borrar');
        } else {
          this.selectedCard = res.data;
          this.creatingNewCard = false;
          this.openSnackBar('Card eliminado', 'Borrar');
          this.getCards();
        }
        this.updatingCard = false;
      }, (err) => {
        //this.closeDialog();
        this.openSnackBar('Ocurrio un error', 'Borrar');
        this.service.isLoadingCards = false;
        this.service.cardsError = true;
        this.updatingCard = false;
        console.log(err);
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CardFormComponent, {
      width: '650px',
      data: this.selectedCard,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result ', result);
      this.selectedCard = result;

      if (!result) {
        return;
      }

      if (this.selectedCard?.id) {
        this.updateCard();
      } else {
        this.saveCard();
      }
    });
  }

  openNewTransactionDialog(): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '650px',
      data: this.selectedTransaction,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result ', result);
      this.selectedTransaction = result;

      if (!result) {
        return;
      }

      this.transactionService.createTransaction(this.selectedTransaction).subscribe(res => {
        //this.closeDialog();
        if (res.code !== "00") {
          this.openSnackBar('ERROR: ' + res.message, 'Guardar');
        } else {

          this.openSnackBar('Transaccion guardado', 'Guardar');

        }
      }, (err) => {
        //this.closeDialog();
        this.openSnackBar('Ocurrio un error: ' + err, 'Guardar');

        console.log(err);
      });

    });
  }


  openTransactionsDialog(hasIdentifier: string): void {
    this.transactionService.getTransactions(hasIdentifier).subscribe( data => {
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
