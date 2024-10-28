import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

import { IUser, UserFactory } from '../../domain';
import { RegisterUserCommand } from '../command';
import { HttpServiceRepository } from '../ports';
import { envs } from '../../../config';
import { ResponseBuildingModel, CODE_ERROR } from '../../../common';
import { RegisterWalletUseCase } from './registerWalletUse-case.service';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly httpServiceRepository: HttpServiceRepository,
    private readonly registerWalletUseCase: RegisterWalletUseCase,
    private readonly userFactory: UserFactory,
  ) {}

  public async registerUser(
    registerUserDto: RegisterUserCommand,
  ): Promise<ResponseBuildingModel<IUser>> {
    try {
      const userExist = await this.userExists(registerUserDto.phoneNumber);

      if (userExist)
        return new ResponseBuildingModel<IUser>(
          false,
          null,
          CODE_ERROR.ERROR_USER_EXITS,
        );

      const user = this.userFactory.create(
        registerUserDto.typeDocument,
        registerUserDto.numberDocument,
        registerUserDto.fullName,
        registerUserDto.email,
        registerUserDto.phoneNumber,
      );

      const resultRegisterUser = await this.httpServiceRepository.post<
        AxiosResponse<ResponseBuildingModel<IUser>>,
        IUser
      >(`${envs.serviceSoap}/user/registerUser`, user);

      if (!resultRegisterUser.data.succeeded)
        return new ResponseBuildingModel<IUser>(
          false,
          null,
          CODE_ERROR.ERROR_REGISTER_USER,
        );

      const resultWallet = await this.registerWalletUseCase.registerWallet({
        userId: user.id,
        phoneNumber: user.phoneNumber,
      });
      if (!resultWallet.succeeded)
        return new ResponseBuildingModel<IUser>(
          false,
          null,
          CODE_ERROR.ERROR_REGISTER_USER,
        );

      return new ResponseBuildingModel<IUser>(
        true,
        resultRegisterUser.data.result,
      );
    } catch (error) {
      throw new ResponseBuildingModel(false, null, CODE_ERROR.ERROR_INTERNAL);
    }
  }

  private async userExists(phoneNumber: string): Promise<boolean> {
    const user = await this.httpServiceRepository.getInformation<
      AxiosResponse<ResponseBuildingModel<IUser>>
    >(`${envs.serviceSoap}/user/findUserByPhoneNumber/${phoneNumber}`);
    return user.data.succeeded;
  }
}
