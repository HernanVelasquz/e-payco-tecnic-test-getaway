import { Injectable } from '@nestjs/common';
import { HttpServiceRepository } from '../ports';
import { WalletRechargerCommands } from '../command';
import { IUser, IWallet } from 'src/user/domain';
import { envs } from 'src/config';
import { CODE_ERROR, ResponseBuildingModel } from 'src/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class RechargeWalletUseCase {
  constructor(private readonly httpServiceRepository: HttpServiceRepository) {}

  public async rechargeWallet(
    walletRechargerCommands: WalletRechargerCommands,
  ): Promise<ResponseBuildingModel<{ boolean; null }>> {
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
