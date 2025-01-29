import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  FieldErrors,
  FieldValues,
  UseFormRegisterReturn,
} from "react-hook-form";

interface InputProps<T extends FieldValues> {
  label: string;
  name: keyof T; // name must be a key of the form values type
  type: string;
  placeholder: string;
  register: UseFormRegisterReturn;
  error: FieldErrors<T>;
  helperText?: string;
  showPassword?: boolean;
  setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
  autoComplete: string;
  fullWidth?: boolean;
  margin?: "dense" | "none" | "normal";
  size?: "small" | "medium";
  variant?: "standard" | "outlined" | "filled";
  style?: React.CSSProperties;
}

const Input = <T extends FieldValues>({
  label,
  name,
  type,
  placeholder,
  register,
  error,
  showPassword,
  setShowPassword,
  helperText,
  disabled,
  autoComplete,
  fullWidth,
  margin,
  size,
  variant,
  style,
  ...otherProps
}: InputProps<T>) => {
  // Rest of your component implementation stays the same
  const handleShowPassword = () => {
    if (setShowPassword) {
      setShowPassword(!showPassword);
    }
  };

  const getInputType = () => {
    if (type === "password") {
      return showPassword ? "text" : "password";
    }
    return type;
  };

  return (
    <TextField
      label={label}
      type={getInputType()}
      placeholder={placeholder}
      fullWidth={fullWidth}
      margin={margin}
      variant={variant}
      sx={style}
      error={!!error[name]}
      helperText={
        typeof error[name]?.message === "string"
          ? error[name]?.message
          : helperText
      }
      disabled={disabled}
      autoComplete={autoComplete}
      size={size}
      slotProps={{
        input: {
          ...register,
          endAdornment: type === "password" && (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
      {...otherProps}
    />
  );
};

export default Input;
