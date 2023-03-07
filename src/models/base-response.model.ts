import {Deserializable} from './deserializable.model';

export class BaseResponse implements Deserializable {

  code: number | undefined;
  data: any;
  count: number | undefined;

  deserialize(input: any) {
    Object.assign(this, input);
    return this;
  }}
