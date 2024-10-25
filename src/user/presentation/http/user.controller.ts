import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RegisterUserDto, WalletRecharger } from './dto';
import {
  RegisterUserUseCase,
  RegisterUserCommand,
  RechargeWalletUseCase,
  WalletRechargerCommands,
} from '../../application';
import { ResponseBuildingModel } from '../../../common';
import { IUser } from '../../domain';

@Controller('user')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly rechargeWalletUseCase: RechargeWalletUseCase,
  ) {}

  @Post('/register-user')
  public registerUser(
    @Body() bodyRegisterUser: RegisterUserDto,
  ): Promise<ResponseBuildingModel<IUser>> {
    return this.registerUserUseCase.registerUser(
      new RegisterUserCommand(
        bodyRegisterUser.typeDocument,
        bodyRegisterUser.numberDocument,
        bodyRegisterUser.fullName,
        bodyRegisterUser.email,
        bodyRegisterUser.phoneNumber,
      ),
    );
  }

  @Post('/wallet-recharger')
  public walletRecharge(@Body() bodyWalletRecharger: WalletRecharger) {
    return this.rechargeWalletUseCase.rechargeWallet(
      new WalletRechargerCommands(
        bodyWalletRecharger.phoneNumber,
        bodyWalletRecharger.documentNumber,
        bodyWalletRecharger.mountRecharger,
      ),
    );
  }

  @Post('/payment')
  public prePayment(@Body() bodyPrePayment) {}

  @Post('/confirm-payment')
  public confirmPayment(@Body() bodyConfirmPayment) {}

  @Get('checkBalance')
  public checkBalance(@Param() numberDocument, @Param() phoneNumber) {}
}
