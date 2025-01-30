const baseUrl = process.env.NEXT_PUBLIC_API_URL;

interface LoginResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: {
    token: string;
    user: {
      email: string;
      userId: string;
    };
  };
}

export async function signUp(email: string, password: string) {
  const response = await fetch(`${baseUrl}signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Signup failed");
  }

  return data;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch(`${baseUrl}signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

export async function sendResetCode(email: string) {
  const response = await fetch(`${baseUrl}send-reset-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to send reset code");
  }

  return data;
}

export async function resetPassword(
  email: string,
  resetCode: string,
  newPassword: string
) {
  const response = await fetch(`${baseUrl}reset-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, resetCode, newPassword }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to reset password");
  }

  return data;
}
