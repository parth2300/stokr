import { AppUser } from "@/types/userTypes"


const USERS_KEY = "stokrUsers"
const CURRENT_USER_KEY = "stokrCurrentUser"

export function getUsers(): AppUser[] {
  if (typeof window === "undefined") return []

  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

export function saveUser(user: AppUser) {
  const users = getUsers()

  const userExists = users.some(
    (savedUser) =>
      savedUser.username.toLowerCase() === user.username.toLowerCase() ||
      savedUser.email.toLowerCase() === user.email.toLowerCase()
  )

  if (userExists) {
    throw new Error("Username or email already exists")
  }

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]))
}

export function loginUser(identifier: string, password: string): AppUser {
  const users = getUsers()

  const foundUser = users.find(
    (user) =>
      (user.username.toLowerCase() === identifier.toLowerCase() ||
        user.email.toLowerCase() === identifier.toLowerCase()) &&
      user.password === password
  )

  if (!foundUser) {
    throw new Error("Invalid login credentials")
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser))
  return foundUser
}

export function getCurrentUser(): AppUser | null {
  if (typeof window === "undefined") return null

  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY)
}