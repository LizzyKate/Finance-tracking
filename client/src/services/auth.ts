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
