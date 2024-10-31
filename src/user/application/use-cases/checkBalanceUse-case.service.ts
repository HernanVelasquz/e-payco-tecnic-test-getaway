import { Injectable } from '@nestjs/common';
import { HttpServiceRepository } from '../ports';
import { ResponseBuildingModel } from '../../../common/response/responseBuilding';
import { CODE_ERROR } from '../../../common/error/codeError.type';
import {  IWallet } from '../../../user/domain/interfaces/wallet.interface';
import {IUser} from '../../../user/domain/interfaces/user.interface'
import { AxiosResponse } from 'axios';
import { envs } from '../../../config/environment.config';

@Injectable()
export class CheckBalanceUseCase {
  constructor(private readonly httpServiceRepository: HttpServiceRepository) {}

  public async checkBalanceWallet(
    numberDocument: string,
    phoneNumber: string,
  ): Promise<ResponseBuildingModel<IWallet>> {
    try {
      const userExists = await this.getInformationUser(numberDocument);

      if (!userExists)
        return new ResponseBuildingModel(
          false,
          null,
          CODE_ERROR.ERROR_USER_NOT_FOUND,
        );
      const walletExists = await this.getInformationWallet(phoneNumber);

      if (!walletExists)
        return new ResponseBuildingModel(
          false,
          null,
          CODE_ERROR.ERROR_WALLET_NOT_FOUND,
        );

      if (walletExists.userId !== userExists.id) {
        return new ResponseBuildingModel(
          false,
          null,
          CODE_ERROR.ERROR_USER_NOT_MATCH,
        );
      }
      return new ResponseBuildingModel(true, walletExists);
    } catch (error) {
      throw new ResponseBuildingModel(false, null, {
        code: error.status,
        error: error.message,
        title: 'Error al verificar el balance de la wallet',
      });
    }
  }

  private async getInformationUser(documentNumber: string): Promise<IUser> {
    const user = await this.httpServiceRepository.getInformation<
      AxiosResponse<ResponseBuildingModel<IUser>>
    >(`${envs.serviceSoap}/user/findUserByDocumentNumber/${documentNumber}`);
    return user.data.result;
  }

  private async getInformationWallet(walletNumber: string): Promise<IWallet> {
    const wallet = await this.httpServiceRepository.getInformation<
      AxiosResponse<ResponseBuildingModel<IWallet>>
    >(`${envs.serviceSoap}/wallet/findWalletByNumber/${walletNumber}`);
    return wallet.data.result;
  }
}
