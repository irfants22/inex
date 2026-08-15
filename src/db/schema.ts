import {
  pgTable,
  pgSchema,
  uuid,
  text,
  timestamp,
  pgEnum,
  numeric,
  date,
  boolean,
} from "drizzle-orm/pg-core";

const authSchema = pgSchema("auth");

export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey().notNull(),
});

export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  fullName: text("full_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const categoryTypeEnum = pgEnum("category_type", ["income", "expense"]);

export const frequencyEnum = pgEnum("frequency", [
  "daily",
  "weekly",
  "monthly",
  "yearly",
]);

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  type: categoryTypeEnum("type").notNull(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const recurringTransactions = pgTable("recurring_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  note: text("note"),
  frequency: frequencyEnum("frequency").notNull(),
  nextRun: date("next_run").notNull(),
  endDate: date("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  recurringTransactionId: uuid("recurring_transaction_id").references(
    () => recurringTransactions.id,
    { onDelete: "set null" },
  ),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  note: text("note"),
  transactionDate: date("transaction_date").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => profiles.id, { onDelete: "cascade" }),
  monthlyLimit: numeric("monthly_limit", { precision: 14, scale: 2 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
