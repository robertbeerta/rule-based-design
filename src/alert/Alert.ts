import { StatusCode } from '../enums/StatusCode';

export class Alert {
  public constructor(public alertData: any,
                     public sender: any,
                     public recipient: any) {
  }

  public send(): StatusCode {
    console.log("SENT");
    return StatusCode.SUCCESS
  }
}