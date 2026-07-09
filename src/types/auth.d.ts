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
