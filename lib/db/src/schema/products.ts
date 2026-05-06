import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const categoryEnum = pgEnum("food_category", [
  "BURGERS",
  "PIZZA",
  "SUSHI",
  "CHICKEN",
  "COFFEE",
  "DESSERTS",
  "SANDWICHES",
  "HEALTHY",
  "PASTA",
  "OTHER",
]);

export const restaurantsTable = pgTable("restaurants", {
  id: uuid("id").primaryKey().defaultRandom(),
  merchantId: uuid("merchant_id")
    .notNull()
    .references(() => usersTable.id),
  name: text("name").notNull(),
  description: text("description"),
  category: categoryEnum("category").notNull().default("OTHER"),
  address: text("address").notNull(),
  imageColor: text("image_color").notNull().default("#D4006A"),
  rating: integer("rating").notNull().default(0),
  deliveryMinutes: integer("delivery_minutes").notNull().default(30),
  minOrder: integer("min_order_cents").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const productsTable = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurantsTable.id),
  name: text("name").notNull(),
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  category: text("category").notNull().default("Main"),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertRestaurantSchema = createInsertSchema(restaurantsTable).omit({
  id: true,
  createdAt: true,
});
export const insertProductSchema = createInsertSchema(productsTable).omit({
  id: true,
  createdAt: true,
});

export type Restaurant = typeof restaurantsTable.$inferSelect;
export type Product = typeof productsTable.$inferSelect;
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
