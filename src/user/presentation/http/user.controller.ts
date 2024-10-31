import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { ResponseBuildingModel } from '../../../common';
import {
  RegisterPaymentCommands,
  RegisterUserCommand,
  WalletRechargerCommands,
} from '../../../user/application';
import {
  CheckBalanceUseCase,
  PaymentUseCaseService,
  RechargeWalletUseCase,
  RegisterUserUseCase,
} from '../../application/use-cases';
import { IUser, IWallet } from '../../domain';
import { RegisterPaymentDto, RegisterUserDto, WalletRecharger } from './dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly rechargeWalletUseCase: RechargeWalletUseCase,
    private readonly checkBalanceUseCase: CheckBalanceUseCase,
    private readonly paymentUseCaseService: PaymentUseCaseService,
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
  public walletRecharge(
    @Body() bodyWalletRecharger: WalletRecharger,
  ): Promise<ResponseBuildingModel<{ boolean; null }>> {
    return this.rechargeWalletUseCase.rechargeWallet(
      new WalletRechargerCommands(
        bodyWalletRecharger.phoneNumber,
        bodyWalletRecharger.documentNumber,
        bodyWalletRecharger.mountRecharger,
      ),
    );
  }

  @Post('/payment')
  public prePayment(@Body() bodyPrePayment: RegisterPaymentDto) {
    return this.paymentUseCaseService.payment(
      new RegisterPaymentCommands(
        bodyPrePayment.phoneNumber,
        bodyPrePayment.discountValue,
      ),
    );
  }

  @Post('/confirm-payment')
  public confirmPayment(@Body() bodyConfirmPayment) {}

  @Get('checkBalance')
  public checkBalance(
    @Query('numberDocument') numberDocument,
    @Query('phoneNumber') phoneNumber,
  ): Promise<ResponseBuildingModel<IWallet>> {
    return this.checkBalanceUseCase.checkBalanceWallet(
      numberDocument,
      phoneNumber,
    );
  }
}
