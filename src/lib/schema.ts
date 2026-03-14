import { pgTable, uuid, varchar, numeric, text, jsonb, timestamp, integer } from 'drizzle-orm/pg-core';

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
