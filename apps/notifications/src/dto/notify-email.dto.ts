export interface NotifyEmailDto {
  email: string;
  subject: string;
  template: string;
  params?: Params;
}

export interface Params {
  name?: string;
  creditId?: number;
  reasonOfRejection?: string;
  iaScore?: number;
}
