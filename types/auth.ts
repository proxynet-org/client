export type SignUpPayload = {
  first_name: string;
  last_name: string;
  username: string;
  birthDate: string;
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
