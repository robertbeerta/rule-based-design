import { AlertStatusEnum } from '../enums/AlertStatusEnum';

export interface AlertInterface {
  id: string;
  status: AlertStatusEnum;
}
