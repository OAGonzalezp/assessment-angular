import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CardData} from "../../models/card-data.model";
import {TransactionData} from "../../models/transaction-data.model";


@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  displayedColumns: string[] = ['number','referenceNumber','buyAmount','buyAddress', 'status'];

  constructor(
    public dialogRef: MatDialogRef<TransactionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionData[],
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
