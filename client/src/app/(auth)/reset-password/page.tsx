"use client";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import Input from "@/components/Input";
import { useResetPasswordSchema } from "@/hooks/auth";
import { useState } from "react";

const ResetPassword = () => {
  const form = useResetPasswordSchema();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    onSubmit,
    openSnackbar,
    handleCloseSnackbar,
    snackbarMessage,
    severity,
  } = form;

  const [showPassword, setShowPassword] = useState(false);
  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 5 }}>
        <Typography variant="h5" align="center">
          Reset Password
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
            <Input
              label="Reset Code"
              name="resetCode"
              type="number"
              fullWidth
              variant="outlined"
              margin="normal"
              placeholder="Enter verification code"
              autoComplete="off"
              error={errors}
              register={register("resetCode", {
                required: "Verification code is required",
              })}
            />
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              placeholder="Enter new password"
              autoComplete="new-password"
              error={errors}
              register={register("newPassword", {
                required: "Password is required",
              })}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isValid}
            >
              Reset Password
            </Button>
          </Box>
        </form>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ResetPassword;
