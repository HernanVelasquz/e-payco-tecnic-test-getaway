import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { WalletFactory } from '../../domain/factories/wallet.factory';
import { HttpServiceRepository } from '../ports';
import { CODE_ERROR, ResponseBuildingModel } from '../../../common';
import { IWallet } from '../../domain';
import { RegisterWalletCommands } from '../command';
import { envs } from '../../../config';

@Injectable()
export class RegisterWalletUseCase {
  constructor(
    private readonly httpServiceRepository: HttpServiceRepository,
    private readonly walletFactory: WalletFactory,
  ) {}

  async registerWallet(
    registerWallet: RegisterWalletCommands,
  ): Promise<ResponseBuildingModel<IWallet>> {
    const wallet = this.walletFactory.create(
      registerWallet.phoneNumber,
      registerWallet.userId,
    );

    const result = await this.httpServiceRepository.post<
      IWallet,
      AxiosResponse
    >(envs.serviceSoap, wallet);

    if (!result.data)
      return new ResponseBuildingModel<IWallet>(
        false,
        null,
        CODE_ERROR.ERROR_REGISTER_USER,
      );

    return new ResponseBuildingModel<IWallet>(true, result.data);
  }
}