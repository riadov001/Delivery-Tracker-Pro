import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userRoleEnum = pgEnum("user_role", [
  "CLIENT",
  "MERCHANT",
  "DRIVER",
  "ADMIN",
]);

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("CLIENT"),
  refreshToken: text("refresh_token"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const selectUserSchema = createSelectSchema(usersTable).omit({
  passwordHash: true,
  refreshToken: true,
});

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  role: z
    .enum(["CLIENT", "MERCHANT", "DRIVER", "ADMIN"])
    .optional()
    .default("CLIENT"),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export type User = typeof usersTable.$inferSelect;
export type UserPublic = Omit<User, "passwordHash" | "refreshToken">;
export type UserRole = "CLIENT" | "MERCHANT" | "DRIVER" | "ADMIN";
