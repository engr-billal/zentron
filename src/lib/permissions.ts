import type { Database } from "@/types/database";

export type UserRole = Database["public"]["Enums"]["user_role"];

export const USER_ROLES = {
  brand: "brand",
  creator: "creator",
  admin: "admin",
} as const satisfies Record<UserRole, UserRole>;

export function hasRole(
  role: UserRole | null | undefined,
  ...allowed: UserRole[]
): boolean {
  return role != null && allowed.includes(role);
}
