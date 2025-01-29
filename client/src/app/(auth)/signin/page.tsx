"use client";
import { Button, Box, Typography, Paper, Container } from "@mui/material";
import Input from "@/components/Input";
import { useLoginSchema, LoginProps } from "@/hooks/auth";
import React, { useState } from "react";

const SignIn = () => {
  const form = useLoginSchema();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    onSubmit,
  } = form;

  const [showPassword, setShowPassword] = useState(false);

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
        </form>
      </Paper>
    </Container>
  );
};

export default SignIn;
