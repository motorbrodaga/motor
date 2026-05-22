export function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function accessTokenPepper() {
  return process.env.ACCESS_TOKEN_PEPPER ?? "development-only-pepper";
}
