"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orders = void 0;
// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
var sqlite_core_1 = require("drizzle-orm/sqlite-core");
exports.orders = (0, sqlite_core_1.sqliteTable)('orders', { id: (0, sqlite_core_1.text)('id').primaryKey(), name: (0, sqlite_core_1.text)('name').notNull(), phone: (0, sqlite_core_1.text)('phone').notNull(), city: (0, sqlite_core_1.text)('city').notNull(), address: (0, sqlite_core_1.text)('address').notNull(), items: (0, sqlite_core_1.text)('items').notNull(), subtotal: (0, sqlite_core_1.integer)('subtotal').notNull(), shipping: (0, sqlite_core_1.integer)('shipping').notNull(), total: (0, sqlite_core_1.integer)('total').notNull(), notes: (0, sqlite_core_1.text)('notes').notNull(), status: (0, sqlite_core_1.text)('status').notNull().default('awaiting_whatsapp_confirmation'), createdAt: (0, sqlite_core_1.text)('created_at').notNull() });
