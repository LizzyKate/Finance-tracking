"use client";
import { Button, Box, Typography, Paper, Container } from "@mui/material";
import Input from "@/components/Input";
import { useSignUpSchema } from "@/hooks/auth";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const router = useRouter();
  const form = useSignUpSchema();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    onSubmit,
  } = form;

  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    router.push("/signin");
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 5 }}>
        <Typography variant="h5" align="center">
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit((data) => onSubmit(data))}>
          <Box sx={{ mt: 2 }}>
            <Input
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
            <Input
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
          </Box>
          <Box sx={{ mt: 2 }}>
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              placeholder="Confirm your password"
              autoComplete="current-password"
              error={errors}
              register={register("confirmPassword", {
                required: "Confirm password is required",
              })}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
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
              onClick={handleSignIn}
              sx={{ textTransform: "none" }}
            >
              Have an account? Sign In
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default SignUp;
