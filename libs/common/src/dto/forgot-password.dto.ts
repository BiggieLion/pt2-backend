export interface ForgotPasswordDto {
  email: string;
  confirmationCode: string;
  newPassword: string;
}
