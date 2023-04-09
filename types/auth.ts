export type SignUpPayload = {
  fullname: string;
  username: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
};

/**
 * @param id - phone, email, or username
 */
export type SignInPayload = { email: string; password: string };

export type Token = {
  access_token: string;
  refresh_token: string;
};
