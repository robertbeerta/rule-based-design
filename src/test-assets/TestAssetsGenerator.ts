import { ChaincodeStub } from 'fabric-shim';
import { State } from '../utils/State';
import { Log } from '../logger/Log';
import * as path from 'path';

export class TestAssetsGenerator {
  private readonly testfilesPath: string = 'testfiles';
  private readonly files: string[] = ['defaultTestSet.json'];

  private readonly state: State;

  public constructor(private readonly chaincodeStub: ChaincodeStub) {
    this.state = new State(chaincodeStub);
  }

  public async initialize(): Promise<void> {
    if (this.chaincodeStub.getArgs().indexOf('generate-test-assets') === -1) {
      return;
    }

    Log.chaincode.info(`Generating test assets from ${this.files.length} file(s)`);
    for (const file of this.files) {
      await this.generateFromFile(file);
    }
  }

  private async generateFromFile(filePath: string): Promise<void> {
    let assets: any[];
    try {
      assets = require(path.resolve(this.testfilesPath, filePath)) as any[];
    } catch (error) {
      Log.chaincode.warn(`Failed to load test assets from '${filePath}': ${JSON.stringify(error)}`);

      throw error;
    }

    try {
      for (const asset of assets) {
        await this.state.put(asset);

        Log.chaincode.info(
          `Generated test asset of type: '${asset.assetType}': ${JSON.stringify(asset, null, 2)}`
        );
      }
      Log.chaincode.info(`Added test assets from: '${filePath}'`);
    } catch (error) {
      Log.chaincode.warn(
        `Failed to generate test assets from '${filePath}': ${JSON.stringify(error)}`
      );

      throw error;
    }
  }
}
