"use client";
import { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Paper,
  Container,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// import { GoogleLogin } from "@react-oauth/google";

// Validation schema using Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Auth = () => {
  const [loginError, setLoginError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    // You can send data to your backend for sign-in here.
    console.log(data);
    // Simulating a successful login
    setLoginError(null); // reset any previous errors
  };

  // const handleGoogleLogin = (response) => {
  //   // You will need to handle the response from Google OAuth here
  //   console.log("Google login successful:", response);
  // };

  // const handleGoogleLoginFailure = (error) => {
  //   console.error("Google login failed:", error);
  //   setLoginError("Google login failed");
  // };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 5 }}>
        <Typography variant="h5" align="center">
          Sign In
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Box>

          {/* Google Sign-In Button */}
          {/* <Box sx={{ mt: 2 }}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleLoginFailure}
              useOneTap
            />
          </Box> */}

          {/* Error message */}
          {loginError && (
            <Typography
              color="error"
              variant="body2"
              sx={{ mt: 2, textAlign: "center" }}
            >
              {loginError}
            </Typography>
          )}

          {/* Submit Button */}
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign In
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
