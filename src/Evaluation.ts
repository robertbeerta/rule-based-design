import { ChaincodeInterface, ChaincodeResponse, ChaincodeStub, Shim } from 'fabric-shim';
import * as util from 'util';
import { MethodComponent } from './enums/MethodComponent';
import { UnknownChaincodeFunctionError } from './errors/UnknownChaincodeFunctionError';
import { FunctionAndParametersInterface } from './interfaces/FunctionAndParametersInterface';
import { Log } from './logger/Log';
import { PayloadSanitizer } from './payload/PayloadSanitizer';
import { TestAssetsGenerator } from './test-assets/TestAssetsGenerator';
import { BaseController } from './utils/BaseController';
import { ControllerFactory } from './utils/ControllerFactory';

export class Evaluation implements ChaincodeInterface {
  private readonly controllerFactory: ControllerFactory;
  private readonly payloadSanitizer: PayloadSanitizer;

  public constructor() {
    this.controllerFactory = new ControllerFactory();
    this.payloadSanitizer = new PayloadSanitizer();
  }

  public async Init(chaincodeStub: ChaincodeStub): Promise<ChaincodeResponse> {
    Log.chaincode.debug('========= Evaluation Init =========');

    await new TestAssetsGenerator(chaincodeStub).initialize();

    Log.chaincode.debug('========= END : Initialize Ledger =========');

    return Shim.success();
  }

  public async Invoke(chaincodeStub: ChaincodeStub): Promise<ChaincodeResponse> {
    Log.chaincode.debug(`Transaction ID: ${chaincodeStub.getTxID()}`);
    const functionAndParameters: FunctionAndParametersInterface = chaincodeStub.getFunctionAndParameters();
    const transientData = chaincodeStub
      .getTransient()
      ?.get('data')
      ?.toString();

    Log.chaincode.debug(util.format('Args: %j', chaincodeStub.getArgs()));
    Log.chaincode.debug(util.format('Transient data: %j', transientData));

    const requestArguments = transientData
      ? [JSON.parse(transientData)]
      : functionAndParameters?.params.map((params) => JSON.parse(params));

    try {
      const controller: BaseController<any> = this.controllerFactory.create(
        chaincodeStub,
        functionAndParameters.fcn.split('.')[MethodComponent.Controller]
      );

      this.throwErrorIfFunctionDoesNotExist(controller, functionAndParameters);

      const payload = await controller[
        functionAndParameters.fcn.split('.')[MethodComponent.Function]
      ].apply(controller, ...requestArguments);

      if (!payload) {
        return Shim.success(Buffer.from(JSON.stringify({})));
      }

      const sanitizedPayload = this.payloadSanitizer.sanitizePayload(payload);

      return Shim.success(Buffer.from(JSON.stringify(sanitizedPayload)));
    } catch (error) {
      Log.chaincode.error(`${error.constructor.name}: ${error}`);

      const errorResponse: ChaincodeResponse = Shim.error(error);
      errorResponse.status = error.status;
      errorResponse.message = error.message;

      return errorResponse;
    }
  }

  private throwErrorIfFunctionDoesNotExist(
    controller: BaseController<any>,
    functionAndParameters: FunctionAndParametersInterface
  ): void {
    if (
      typeof controller[functionAndParameters.fcn.split('.')[MethodComponent.Function]] !==
      'function'
    ) {
      throw new UnknownChaincodeFunctionError(functionAndParameters.fcn);
    }
  }
}
