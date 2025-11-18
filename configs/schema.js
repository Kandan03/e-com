import { integer, numeric, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  image: varchar(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const productsTable = pgTable("product", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar().notNull(),
  price: numeric().notNull(),
  description: text().notNull(),
  category: varchar().notNull(),
  imageUrl: varchar().notNull(),
  fileUrl: varchar(),
  createdBy: varchar("createdBy")
    .notNull()
    .references(() => usersTable.email),
});
