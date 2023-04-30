export type SignUpPayload = {
  fullname: string;
  username: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
};

/**
 * @param id - username
 */
export type SignInPayload = { username: string; password: string };

export type Token = {
  access: string;
  refresh: string;
};
