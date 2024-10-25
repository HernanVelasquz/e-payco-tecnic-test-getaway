import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';

import { IUser, UserFactory } from '../../domain';
import { RegisterUserCommand } from '../command';
import { HttpServiceRepository } from '../ports';
import { envs } from '../../../config';
import { ResponseBuildingModel, CODE_ERROR } from '../../../common';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly httpServiceRepository: HttpServiceRepository,
    private readonly userFactory: UserFactory,
  ) {}

  async registerUser(
    registerUserDto: RegisterUserCommand,
  ): Promise<ResponseBuildingModel<IUser>> {
    try {
      const userExist = await this.userExists(registerUserDto.phoneNumber);

      if(userExist) return new ResponseBuildingModel<IUser>(false, null, CODE_ERROR.ERROR_USER_EXITS);


      const user = this.userFactory.create(
        registerUserDto.typeDocument,
        registerUserDto.numberDocument,
        registerUserDto.fullName,
        registerUserDto.email,
        registerUserDto.phoneNumber,
      );
  
      const result = await this.httpServiceRepository.post<IUser, AxiosResponse>(
        envs.serviceSoap,
        user,
      );

      if (!result.data) return new ResponseBuildingModel<IUser>(false, null, CODE_ERROR.ERROR_REGISTER_USER);
      return new ResponseBuildingModel<IUser>(true, result.data);
    } catch (error) {
      throw new ResponseBuildingModel(false, null, CODE_ERROR.ERROR_INTERNAL)
    }
  }

  private async userExists(phoneNumber: string): Promise<boolean> {
    return await this.httpServiceRepository.getInformationUser(phoneNumber);
  }
}
