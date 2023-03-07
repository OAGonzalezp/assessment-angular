import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CardData} from "../../models/card-data.model";
import {TransactionData} from "../../models/transaction-data.model";


@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})

export class TransactionFormComponent {
  constructor(
    public dialogRef: MatDialogRef<TransactionFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
