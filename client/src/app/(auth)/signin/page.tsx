"use client";
import { Button, Box, Typography, Paper, Container } from "@mui/material";
import Input from "@/components/Input";
import { useLoginSchema, LoginProps } from "@/hooks/auth";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SignIn = () => {
  const router = useRouter();
  const form = useLoginSchema();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    onSubmit,
  } = form;

  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleForgotPassword = () => {
    router.push("/send-reset-code");
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 5 }}>
        <Typography variant="h5" align="center">
          Sign In
        </Typography>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <Box sx={{ mt: 2 }}>
            <Input<LoginProps>
              label="Email"
              name="email"
              type="email"
              fullWidth
              variant="outlined"
              margin="normal"
              placeholder="Enter your email"
              autoComplete="email"
              error={errors}
              register={register("email", { required: "Email is required" })}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Input<LoginProps>
              label="Password"
              name="password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              placeholder="Enter your password"
              autoComplete="current-password"
              error={errors}
              register={register("password", {
                required: "Password is required",
              })}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
            <Button
              variant="text"
              onClick={handleForgotPassword}
              sx={{
                textTransform: "none",
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              Forgot Password?
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={!isValid}
            >
              Sign In
            </Button>
          </Box>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Button
              variant="text"
              onClick={handleSignUp}
              sx={{ textTransform: "none" }}
            >
              Don&apos;t have an account? Sign Up
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default SignIn;
