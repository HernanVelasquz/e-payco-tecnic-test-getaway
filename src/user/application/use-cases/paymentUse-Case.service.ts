import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

import {IWallet} from '../../domain/interfaces/wallet.interface'
import { IUser } from '../../domain/interfaces/user.interface';
import { CODE_ERROR } from '../../../common/error/codeError.type';
import { envs } from '../../../config';
import { RegisterPaymentCommands } from '../command/registerPayment.commands';
import {ResponseBuildingModel} from '../../../common/response/responseBuilding';
import {
  AttemptControlRepository,
  HttpServiceRepository,
  SendGridMailRepository,
  TokenServiceRepository,
} from '../ports';

@Injectable()
export class PaymentUseCaseService {
  private readonly REQUEST_PAYMENT = 'REQUEST_PAYMENT';
  constructor(
    private readonly httpServiceRepository: HttpServiceRepository,
    private readonly tokenServiceRepository: TokenServiceRepository,
    private readonly attemptControlRepository: AttemptControlRepository,
    private readonly sendGridMailRepository: SendGridMailRepository,
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
      const redisObjectPayment = {
        token: token,
        payment: bodyRegisterPayment.discountValue,
      };

      const user = await this.getInformationUser(
        bodyRegisterPayment.phoneNumber,
      );

      await this.attemptControlRepository.setCache(
        typeRequest,
        JSON.stringify(redisObjectPayment),
      );

      const resultSendEmail = await this.sendGridMailRepository.sendEmailWithTemplate(user.email, {
        discountValue: bodyRegisterPayment.discountValue,
        codePayment: token,
      });

      return new ResponseBuildingModel(true,resultSendEmail)
    } catch (error) {}
  }

  private async getInformationUser(phoneNumber: string): Promise<IUser> {
    const user = await this.httpServiceRepository.getInformation<
      AxiosResponse<ResponseBuildingModel<IUser>>
    >(`${envs.serviceSoap}/user/findUserByPhoneNumber/${phoneNumber}`);
    return user.data.result;
  }

  private async getInformationWallet(walletNumber: string): Promise<IWallet> {
    const wallet = await this.httpServiceRepository.getInformation<
      AxiosResponse<ResponseBuildingModel<IWallet>>
    >(`${envs.serviceSoap}/wallet/findWalletByNumber/${walletNumber}`);
    return wallet.data.result;
  }

  private async validatePaymentExist(keyAttempt: string): Promise<boolean> {
    const exitsPayment =
      await this.attemptControlRepository.getCache(keyAttempt);
    return !!exitsPayment;
  }
}
