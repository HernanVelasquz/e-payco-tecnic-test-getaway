import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor() {}

  @Post('/register-user')
  public registerUser(@Body() registerUser: any) {}

  @Post('/wallet-recharger')
  public walletRecharge(@Body() bodyWalletRecharger) {}

  @Post('/payment')
  public prePayment(@Body() bodyPrePayment) {}

  @Post('/confirm-payment')
  public confirmPayment(@Body() bodyConfirmPayment) {}

  @Get('checkBalance')
  public checkBalance(@Param() numberDocument, @Param() phoneNumber) {}
}
