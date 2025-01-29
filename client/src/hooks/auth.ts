import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export interface LoginProps {
  email: string;
  password: string;
}

export interface SignUpProps {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordProps {
  email: string;
  resetCode: string;
  newPassword: string;
}
export const useLoginSchema = (handleSubmit: (data: LoginProps) => void) => {
  const schema = useForm<LoginProps>({
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email("Invalid email format")
          .required("Email is required"),
        password: yup
          .string()
          .min(6, "Password must be at least 6 characters")
          .matches(/[A-Za-z]/, "Password must contain at least one letter")
          .matches(/[0-9]/, "Password must contain at least one number")
          .matches(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
          )
          .required("Password is required"),
      })
    ),
    mode: "all",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: LoginProps) => {
    handleSubmit(data);
  };

  return {
    ...schema,
    onSubmit,
  };
};

export const useSignUpSchema = (handleSubmit: (data: SignUpProps) => void) => {
  const schema = useForm<SignUpProps>({
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email("Invalid email format")
          .required("Email is required"),
        password: yup
          .string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        confirmPassword: yup
          .string()
          .oneOf([yup.ref("password"), undefined], "Passwords must match")
          .required("Confirm password is required"),
      })
    ),
    mode: "all",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: SignUpProps) => {
    handleSubmit(data);
  };

  return {
    ...schema,
    onSubmit,
  };
};

export const useGetForgotPasswordCodeSchema = (
  handleSubmit: (data: { email: string }) => void
) => {
  const schema = useForm<{ email: string }>({
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email("Invalid email format")
          .required("Email is required"),
      })
    ),
    mode: "all",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: { email: string }) => {
    handleSubmit(data);
  };

  return {
    ...schema,
    onSubmit,
  };
};

export const useResetPasswordSchema = (
  handleSubmit: (data: ForgotPasswordProps) => void
) => {
  const schema = useForm<ForgotPasswordProps>({
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email("Invalid email format")
          .required("Email is required"),
        resetCode: yup
          .string()
          .length(6, "Verification code must be 6 digits")
          .matches(/^\d+$/, "Verification code must contain only numbers")
          .required("Verification code is required"),
        newPassword: yup
          .string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
      })
    ),
    mode: "all",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordProps) => {
    handleSubmit(data);
  };

  return {
    ...schema,
    onSubmit,
  };
};
