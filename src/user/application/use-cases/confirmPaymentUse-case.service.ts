import { Injectable } from '@nestjs/common';
import { AttemptControlRepository, HttpServiceRepository } from '../ports';
import { ResponseBuildingModel } from '../../../common/response/responseBuilding';
import { AxiosResponse } from 'axios';
import { envs } from '../../../config/environment.config';
import { IWallet } from '../../../user/domain/interfaces/wallet.interface';
import { CODE_ERROR } from '../../../common/error'
import { ConfirmPaymentCommand } from '../command/confirmPayment.commands';
@Injectable()
export class ConfirmPaymentUseCase {
  constructor(
    private readonly httpServiceRepository: HttpServiceRepository,
    private readonly attemptControlRepository: AttemptControlRepository,
  ) {}

  public async confirmPayment(
    bodyConfirmPayment: ConfirmPaymentCommand,
  ): Promise<ResponseBuildingModel<{message: string}>> {
    try {
      const redisKey = `REQUEST_PAYMENT:${bodyConfirmPayment.phoneNumber}`;
      const redisObjectPayment =
        await this.attemptControlRepository.getCache(redisKey);
      if (!redisObjectPayment) {
        return new ResponseBuildingModel(false, null, CODE_ERROR.ERROR_TOKEN_EXPIRED);
      }
      const payment = JSON.parse(redisObjectPayment);

      if(payment.token !== bodyConfirmPayment.token) {
        return new ResponseBuildingModel(false, null, CODE_ERROR.ERROR_TOKEN_NOT_MATCH)
      }

      await this.attemptControlRepository.deleteCache(redisKey);


      const wallet = await this.getInformationWallet(payment.phoneNumber);

      if (wallet.balance == 0 ) {
        return new ResponseBuildingModel(false, null, CODE_ERROR.ERROR_BALANCE_INSUFFICIENT);
      }

      const discountPayment = wallet.balance - payment.payment;
      if (discountPayment < 0) {
        return new ResponseBuildingModel(false, null, CODE_ERROR.ERROR_BALANCE_INSUFFICIENT);
      }
      wallet.balance = discountPayment;

      await this.updateBalance(payment.phoneNumber, wallet.balance);

      return new ResponseBuildingModel(true, { message: 'Pago confirmado' });
    } catch (error) {
      return new ResponseBuildingModel(
        false,
        null,
        CODE_ERROR.ERROR_PROCESS_FAILED,
      );
    }
  }

  private async getInformationWallet(walletNumber: string): Promise<IWallet> {
    const wallet = await this.httpServiceRepository.getInformation<
      AxiosResponse<ResponseBuildingModel<IWallet>>
    >(`${envs.serviceSoap}/wallet/findWalletByNumber/${walletNumber}`);
    return wallet.data.result;
  }

  private async updateBalance(
    walletNumber: string,
    amount: number,
  ): Promise<boolean> {
    const uploadBalance = this.httpServiceRepository.post<
      AxiosResponse<ResponseBuildingModel<{ walletNumber; amount }>>,
      { newValance }
    >(`${envs.serviceSoap}/wallet/${walletNumber}/updateBalance`, {
      newValance: amount,
    });
    return !!uploadBalance;
  }
}
