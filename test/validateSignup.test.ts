import { describe, expect, it } from "vitest"
import { validateSignup } from "@/app/lib/validateSignup"

describe("validateSignup", () => {
  it("passes valid signup input", () => {
    const result = validateSignup("parth_123", "parth@example.com", "Password1")
    expect(result).toBeNull()
  })

  it("rejects empty username", () => {
    const result = validateSignup("", "parth@example.com", "Password1")
    expect(result).toBe("Username is required")
  })

  it("rejects invalid username characters", () => {
    const result = validateSignup("parth!!!", "parth@example.com", "Password1")
    expect(result).toContain("Username must be")
  })

  it("rejects short username", () => {
    const result = validateSignup("pa", "parth@example.com", "Password1")
    expect(result).toContain("Username must be")
  })

  it("rejects invalid email", () => {
    const result = validateSignup("parth", "bademail", "Password1")
    expect(result).toBe("Enter a valid email address")
  })

  it("rejects short password", () => {
    const result = validateSignup("parth", "parth@example.com", "Pass1")
    expect(result).toBe("Password must be at least 8 characters")
  })

  it("rejects password without uppercase letter", () => {
    const result = validateSignup("parth", "parth@example.com", "password1")
    expect(result).toBe("Password must contain at least one uppercase letter")
  })

  it("rejects password without lowercase letter", () => {
    const result = validateSignup("parth", "parth@example.com", "PASSWORD1")
    expect(result).toBe("Password must contain at least one lowercase letter")
  })

  it("rejects password without number", () => {
    const result = validateSignup("parth", "parth@example.com", "Password")
    expect(result).toBe("Password must contain at least one number")
  })
})