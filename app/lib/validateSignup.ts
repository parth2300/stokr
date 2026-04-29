export function validateSignup(
  username: string,
  email: string,
  password: string
): string | null {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!username.trim()) {
    return "Username is required"
  }

  if (!usernameRegex.test(username)) {
    return "Username must be 3–20 characters and can only contain letters, numbers, and underscores"
  }

  if (!email.trim()) {
    return "Email is required"
  }

  if (!emailRegex.test(email)) {
    return "Enter a valid email address"
  }

  if (!password) {
    return "Password is required"
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters"
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter"
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter"
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number"
  }

  return null
}