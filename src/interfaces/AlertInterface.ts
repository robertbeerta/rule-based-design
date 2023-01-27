import { ActivationStatusEnum } from '../enums/AlertStatusEnum';

export interface AlertInterface {
  id: string;
  status: ActivationStatusEnum;
}
