"use client";
import {
  Button,
  Box,
  Typography,
  Paper,
  Container,
  Snackbar,
  Alert,
} from "@mui/material";
import Input from "@/components/Input";
import { useResetCodeSchema } from "@/hooks/auth";

const ResetCode = () => {
  const form = useResetCodeSchema();

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

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 5 }}>
        <Typography variant="h5" align="center">
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit((data) => onSubmit(data.email))}>
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isValid}
            >
              Send Reset Code
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

export default ResetCode;
