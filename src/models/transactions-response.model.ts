import {Deserializable} from './deserializable.model';

export class TransactionsResponse implements Deserializable {

  code: number | undefined;
  message: string | undefined;
  transactions: any;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }}
