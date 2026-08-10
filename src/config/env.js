const required = ["MONGODB_URI", "JWT_SECRET"];

export function validateEnv() {
  for (const key of required) {
    if (!process.env[key]) {
      console.warn(`[Env Warning] ${key} is not set. Using default fallback.`);
    }
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 3000),
  appOrigin: process.env.APP_ORIGIN || "http://localhost:3000",
  trustProxy: Number(process.env.TRUST_PROXY || 1),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/workiffy",
  jwtSecret: process.env.JWT_SECRET || "default_workiffy_secret_key_minimum_48_characters_long_for_security_fallback",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  enforceSubscriptions:
    String(process.env.ENFORCE_SUBSCRIPTIONS || "false").toLowerCase() === "true",
  supportEmail: process.env.SUPPORT_EMAIL || "support@workiffy.com"
};
