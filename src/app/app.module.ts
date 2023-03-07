import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import {MaterialModule} from "./material.module";
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { CardFormComponent } from './card-form/card-form.component';
import {MatRadioModule} from "@angular/material/radio";
import {TransactionFormComponent} from "./transaction-form/transaction-form.component";
import { TransactionsComponent } from './transactions/transactions.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CardFormComponent,
    TransactionFormComponent,
    TransactionsComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        HttpClientModule,
        MatRadioModule
    ],
  exports: [FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent, DashboardComponent]
})
export class AppModule { }
