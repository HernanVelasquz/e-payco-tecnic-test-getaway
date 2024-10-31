import { Injectable } from '@nestjs/common';
import { HttpServiceRepository } from '../ports';
import { WalletRechargerCommands } from '../command';
import { IWallet } from '../../../user/domain/interfaces/wallet.interface';
import { IUser } from '../../../user/domain/interfaces/user.interface';
import { envs } from '../../../config/environment.config';
import { CODE_ERROR } from '../../../common/error/codeError.type';
import { ResponseBuildingModel } from '../../../common/response/responseBuilding';
import { AxiosResponse } from 'axios';

@Injectable()
export class RechargeWalletUseCase {
  constructor(private readonly httpServiceRepository: HttpServiceRepository) {}

  public async rechargeWallet(
    walletRechargerCommands: WalletRechargerCommands,
  ): Promise<ResponseBuildingModel<{ boolean; null }>> {
    try {
      const userExists = await this.getInformationUser(
        walletRechargerCommands.documentNumber,
      );
      if (!userExists)
        throw new ResponseBuildingModel(
          false,
          null,
          CODE_ERROR.ERROR_USER_NOT_FOUND,
        );

      const walletExists = await this.getInformationWallet(
        walletRechargerCommands.phoneNumber,
      );
      if (!walletExists)
        throw new ResponseBuildingModel(
          false,
          null,
          CODE_ERROR.ERROR_WALLET_NOT_FOUND,
        );

      const newBalance =
        walletExists.balance + walletRechargerCommands.mountRecharger;

      await this.updateBalance(walletExists.phoneNumber, newBalance);

      return new ResponseBuildingModel(true, null);
    } catch (error) {
      throw new ResponseBuildingModel(false, null, {
        code: error.status,
        error: error.message,
        title: 'Error Internal',
      });
    }
  }

  private async getInformationUser(userDocument: string): Promise<IUser> {
    const user = await this.httpServiceRepository.getInformation<
      AxiosResponse<ResponseBuildingModel<IUser>>
    >(`${envs.serviceSoap}/user/findUserByDocumentNumber/${userDocument}`);
    return user.data.result;
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
