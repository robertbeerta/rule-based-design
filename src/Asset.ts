import { AssetType } from './enums/AssetType';

export class Asset {
  public constructor(public assetType: AssetType, public id: string) {}
}
