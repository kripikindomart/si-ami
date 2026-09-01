import { pgTable, uuid, varchar, text, timestamp, boolean, index, unique, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// ENUMS
// ============================================

export const statusEnum = pgEnum("status", ["aktif", "nonaktif"]);

// ============================================
// USER MANAGEMENT TABLES
// ============================================

// 1. Roles
export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  nama: varchar("nama", { length: 50 }).unique().notNull(),
  deskripsi: text("deskripsi"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 2. Users (extends auth.users dari Supabase/custom auth)
export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // references auth.users(id)
  nama: varchar("nama", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  roleId: uuid("role_id").references(() => roles.id).notNull(),
  status: statusEnum("status").default("aktif").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  roleIdx: index("idx_users_role").on(table.roleId),
  statusIdx: index("idx_users_status").on(table.status),
  emailIdx: index("idx_users_email").on(table.email),
}));

// 3. Permissions
export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleId: uuid("role_id").references(() => roles.id, { onDelete: "cascade" }).notNull(),
  modul: varchar("modul", { length: 50 }).notNull(),
  canCreate: boolean("can_create").default(false).notNull(),
  canRead: boolean("can_read").default(false).notNull(),
  canUpdate: boolean("can_update").default(false).notNull(),
  canDelete: boolean("can_delete").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  roleIdx: index("idx_permissions_role").on(table.roleId),
  modulIdx: index("idx_permissions_modul").on(table.modul),
  uniqueRoleModul: unique("unique_role_modul").on(table.roleId, table.modul),
}));

// 4. User Unit (many-to-many pivot)
// Note: unit_kerja table akan dibuat di modul lain
export const userUnit = pgTable("user_unit", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  unitKerjaId: uuid("unit_kerja_id").notNull(), // FK ke unit_kerja (akan dibuat nanti)
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdx: index("idx_user_unit_user").on(table.userId),
  unitIdx: index("idx_user_unit_unit").on(table.unitKerjaId),
  uniqueUserUnit: unique("unique_user_unit").on(table.userId, table.unitKerjaId),
}));

// ============================================
// RELATIONS
// ============================================

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
  permissions: many(permissions),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  userUnits: many(userUnit),
}));

export const permissionsRelations = relations(permissions, ({ one }) => ({
  role: one(roles, {
    fields: [permissions.roleId],
    references: [roles.id],
  }),
}));

export const userUnitRelations = relations(userUnit, ({ one }) => ({
  user: one(users, {
    fields: [userUnit.userId],
    references: [users.id],
  }),
  // unitKerja relation akan ditambah nanti
}));

// ============================================
// TYPES (for TypeScript inference)
// ============================================

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;

export type UserUnit = typeof userUnit.$inferSelect;
export type NewUserUnit = typeof userUnit.$inferInsert;
