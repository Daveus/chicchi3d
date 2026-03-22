import { pgTable, uuid, varchar, numeric, text, jsonb, timestamp, integer, serial } from 'drizzle-orm/pg-core';

// --- PRODUCTS ---
export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    category: varchar('category', { length: 50 }).notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    description: text('description').notNull().default(''),
    images: jsonb('images').notNull().default([]),
    numberSaled: integer('number_saled').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

// --- USERS ---
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    nome: varchar('nome', { length: 100 }).notNull(),
    cognome: varchar('cognome', { length: 100 }).notNull(),
    indirizzo: varchar('indirizzo', { length: 255 }),
    citta: varchar('citta', { length: 100 }),
    cap: varchar('cap', { length: 10 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// --- FAVORITES ---
export const favorites = pgTable('favorites', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
});

export type Favorite = typeof favorites.$inferSelect;

// --- ORDERS ---
export const orders = pgTable('orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }), // nullable per ordini guest
    guestEmail: varchar('guest_email', { length: 255 }),
    nomeSpedizione: varchar('nome_spedizione', { length: 255 }),
    indirizzoSpedizione: varchar('indirizzo_spedizione', { length: 500 }),
    dataOrdine: timestamp('data_ordine').defaultNow().notNull(),
    totale: numeric('totale', { precision: 10, scale: 2 }).notNull(),
    stato: varchar('stato', { length: 50 }).notNull().default('in_elaborazione'),
    dettagliProdotti: jsonb('dettagli_prodotti').notNull().default([]),
});

export type Order = typeof orders.$inferSelect;

// --- CUSTOM ORDERS (CREA SU MISURA) ---
export const customOrders = pgTable('custom_orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    productType: varchar('product_type', { length: 50 }).notNull(), // es. "LAMPADE"
    configurationData: jsonb('configuration_data').notNull().default({}),
    baseText: text('base_text'),
    notes: text('notes'),
    status: varchar('status', { length: 50 }).notNull().default('in_attesa_di_preventivo'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type CustomOrder = typeof customOrders.$inferSelect;

// --- ADMIN SETTINGS ---
export const adminSettings = pgTable('admin_settings', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 100 }).notNull().default('admin'),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type AdminSettings = typeof adminSettings.$inferSelect;
