export * from "./models/auth";
import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";
import { relations } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(), // 'Male' | 'Female'
  denomination: text("denomination").notNull(),
  location: text("location").notNull(),
  occupation: text("occupation"),
  aboutMe: text("about_me"),
  partnerPreferences: text("partner_preferences"),
  photoUrl: text("photo_url"),
  createdBy: text("created_by").notNull(), // 'Self', 'Parent', etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  userId: true
});

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
