// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const orders=sqliteTable('orders',{id:text('id').primaryKey(),name:text('name').notNull(),phone:text('phone').notNull(),city:text('city').notNull(),address:text('address').notNull(),items:text('items').notNull(),subtotal:integer('subtotal').notNull(),shipping:integer('shipping').notNull(),total:integer('total').notNull(),notes:text('notes').notNull(),status:text('status').notNull().default('awaiting_whatsapp_confirmation'),createdAt:text('created_at').notNull()});
