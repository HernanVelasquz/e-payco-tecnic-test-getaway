import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { RegisterUserDto, WalletRecharger } from './dto';
import {
  RegisterUserUseCase,
  RechargeWalletUseCase,
  CheckBalanceUseCase,
} from '../../application/use-cases';
import { ResponseBuildingModel } from '../../../common';
import { IUser } from '../../domain';
import {
  RegisterUserCommand,
  WalletRechargerCommands,
} from 'src/user/application';

@Controller('user')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly rechargeWalletUseCase: RechargeWalletUseCase,
    private readonly checkBalanceUseCase: CheckBalanceUseCase,
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
  public checkBalance(
    @Query('numberDocument') numberDocument,
    @Query('phoneNumber') phoneNumber,
  ) {
    return this.checkBalanceUseCase.checkBalanceWallet(
      numberDocument,
      phoneNumber,
    );
  }
}
