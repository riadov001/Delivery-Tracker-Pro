import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { restaurantsTable } from "./products";

export const orderStatusEnum = pgEnum("order_status", [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY_FOR_PICKUP",
  "PICKED_UP",
  "DELIVERED",
  "CANCELLED",
]);

export interface OrderLineItem {
  productId: string;
  name: string;
  quantity: number;
  priceCents: number;
}

export const ordersTable = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  clientId: uuid("client_id")
    .notNull()
    .references(() => usersTable.id),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurantsTable.id),
  driverId: uuid("driver_id").references(() => usersTable.id),
  status: orderStatusEnum("status").notNull().default("PENDING"),
  items: jsonb("items").$type<OrderLineItem[]>().notNull(),
  totalCents: integer("total_cents").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({
  id: true,
  driverId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type Order = typeof ordersTable.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "DELIVERED"
  | "CANCELLED";
