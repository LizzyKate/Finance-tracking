import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { login, sendResetCode, resetPassword, signUp } from "../services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

export const useLoginSchema = () => {
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
          // .matches(/[A-Za-z]/, "Password must contain at least one letter")
          // .matches(/[0-9]/, "Password must contain at least one number")
          // .matches(
          //   /[^A-Za-z0-9]/,
          //   "Password must contain at least one special character"
          // )
          .required("Password is required"),
      })
    ),
    mode: "all",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: LoginProps) => {
    try {
      const response = await login(data.email, data.password);

      if (response.success) {
        console.log("Login successful:", response.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return {
    ...schema,
    onSubmit,
  };
};

export const useSignUpSchema = () => {
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
          .matches(/[A-Za-z]/, "Password must contain at least one letter")
          .matches(/[0-9]/, "Password must contain at least one number")
          .matches(
            /[^A-Za-z0-9]/,
            "Password must contain at least one special character"
          )
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
    try {
      const response = await signUp(data.email, data.password);

      if (response.success) {
        console.log("Signup successful:", response.message);
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return {
    ...schema,
    onSubmit,
  };
};

export const useResetCodeSchema = () => {
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");

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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const onSubmit = async (email: string) => {
    try {
      const response = await sendResetCode(email);

      if (response.sucess) {
        setSnackbarMessage(response.message || "Reset code sent successfully!");
        setSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push("/reset-password");
        }, 2000);
      }
    } catch (error) {
      if (error instanceof Error) {
        setSnackbarMessage(error.message || "An unexpected error occurred");
      } else {
        setSnackbarMessage("An unexpected error occurred");
      }
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return {
    ...schema,
    onSubmit,
    openSnackbar,
    handleCloseSnackbar,
    snackbarMessage,
    severity,
  };
};

export const useResetPasswordSchema = () => {
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const schema = useForm<ForgotPasswordProps>({
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email("Invalid email format")
          .required("Email is required"),
        resetCode: yup
          .string()
          .length(5, "Reset code must be 5 digits")
          .max(5, "Reset code must be 5 digits")
          .matches(/^\d+$/, "Reset code must contain only numbers")
          .required("Reset code is required"),
        newPassword: yup
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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const onSubmit = async (data: ForgotPasswordProps) => {
    try {
      const response = await resetPassword(
        data.email,
        data.resetCode,
        data.newPassword
      );

      if (response.sucess) {
        setSnackbarMessage(response.message || "Password reset successfully!");
        setSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      }
    } catch (error) {
      if (error instanceof Error) {
        setSnackbarMessage(error.message || "An unexpected error occurred");
      } else {
        setSnackbarMessage("An unexpected error occurred");
      }
      setSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return {
    ...schema,
    onSubmit,
    openSnackbar,
    handleCloseSnackbar,
    snackbarMessage,
    severity,
  };
};
