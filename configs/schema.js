import { integer, numeric, pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  image: varchar(),
  email: varchar({ length: 255 }).notNull().unique(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productsTable = pgTable("product", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar().notNull(),
  price: numeric().notNull(),
  description: text().notNull(),
  category: varchar().notNull(),
  imageUrl: varchar().notNull(),
  fileUrl: varchar(),
  isFeatured: boolean("is_featured").default(false),
  createdBy: varchar("createdBy")
    .notNull()
    .references(() => usersTable.email),
});

export const cartItemsTable = pgTable("cart_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userEmail: varchar("user_email")
    .notNull()
    .references(() => usersTable.email),
  productId: integer("product_id")
    .notNull()
    .references(() => productsTable.id),
  quantity: integer().notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ordersTable = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userEmail: varchar("user_email")
    .notNull()
    .references(() => usersTable.email),
  stripeSessionId: varchar("stripe_session_id").notNull().unique(),
  totalAmount: numeric("total_amount").notNull(),
  status: varchar().notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItemsTable = pgTable("order_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer("order_id")
    .notNull()
    .references(() => ordersTable.id),
  productId: integer("product_id")
    .notNull()
    .references(() => productsTable.id),
  quantity: integer().notNull(),
  price: numeric().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categoriesTable = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 100 }).notNull().unique(),
  description: text(),
  icon: varchar(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteSettingsTable = pgTable("site_settings", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  key: varchar({ length: 100 }).notNull().unique(),
  value: text(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ticketsTable = pgTable("tickets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userEmail: varchar("user_email").notNull(),
  userName: varchar("user_name").notNull(),
  subject: varchar({ length: 255 }).notNull(),
  status: varchar({ length: 50 }).notNull().default("open"), // open, in_progress, resolved, closed
  priority: varchar({ length: 50 }).notNull().default("medium"), // low, medium, high
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ticketMessagesTable = pgTable("ticket_messages", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  ticketId: integer("ticket_id")
    .notNull()
    .references(() => ticketsTable.id),
  senderEmail: varchar("sender_email").notNull(),
  senderName: varchar("sender_name").notNull(),
  message: text().notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
