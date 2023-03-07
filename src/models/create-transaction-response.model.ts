import {Deserializable} from './deserializable.model';

export class CreateTransactionResponseModel implements Deserializable {

  code: string | undefined;
  message: string | undefined
  referenceNumber: string | undefined
    status: string | undefined

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }}
