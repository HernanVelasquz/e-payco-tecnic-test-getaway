import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

import { IWallet } from '../../domain';
import { CODE_ERROR, ResponseBuildingModel } from '../../../common';
import { envs } from '../../../config';
import { RegisterPaymentCommands } from '../command';
import {
  AttemptControlRepository,
  HttpServiceRepository,
  TokenServiceRepository,
} from '../ports';

@Injectable()
export class PaymentUseCaseService {
  private readonly REQUEST_PAYMENT = 'REQUEST_PAYMENT';
  constructor(
    private readonly httpServiceRepository: HttpServiceRepository,
    private readonly tokenServiceRepository: TokenServiceRepository,
    private readonly attemptControlRepository: AttemptControlRepository,
  ) {}

  public async payment(bodyRegisterPayment: RegisterPaymentCommands) {
    try {
      const typeRequest = `${this.REQUEST_PAYMENT}:${bodyRegisterPayment.phoneNumber}`;
      const wallet = await this.getInformationWallet(
        bodyRegisterPayment.phoneNumber,
      );
      if (!wallet) {
        return new ResponseBuildingModel(
          false,
          null,
          CODE_ERROR.ERROR_WALLET_NOT_FOUND,
        );
      }
      const existPayment = await this.validatePaymentExist(typeRequest);
      if (existPayment) {
        return new ResponseBuildingModel(
          true,
          'Existe un pago pendiente, por favor valide su correo',
        );
      }
      const token = await this.tokenServiceRepository.generateToken();
      await this.attemptControlRepository.setCache(typeRequest, String(token));
    } catch (error) {}
  }

  private async getInformationWallet(walletNumber: string): Promise<IWallet> {
    const wallet = await this.httpServiceRepository.getInformation<
      AxiosResponse<ResponseBuildingModel<IWallet>>
    >(`${envs.serviceSoap}/wallet/findWalletByNumber/${walletNumber}`);
    return wallet.data.result;
  }

  private async validatePaymentExist(keyAttempt: string): Promise<boolean> {
    const exitsPayment = this.attemptControlRepository.getCache(keyAttempt);
    return !!exitsPayment
  }
}
