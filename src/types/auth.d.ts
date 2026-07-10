export type RegisterFormState = {
  status?: string;
  errors?: {
    email?: string[];
    fullName?: string[];
    password?: string[];
    confirmPassword?: string[];
    _form?: string[];
  };
};

export type LoginFormState = {
  status?: string;
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
};
