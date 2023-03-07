import {Deserializable} from './deserializable.model';

export class CreateCardResponseModel implements Deserializable {

  code: string | undefined;
  message: string | undefined
  validationCode: number | undefined;
  pan: string | undefined;
  hashIdentifier: string | undefined;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }}
