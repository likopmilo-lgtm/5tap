CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`city` text NOT NULL,
	`address` text NOT NULL,
	`items` text NOT NULL,
	`subtotal` integer NOT NULL,
	`shipping` integer NOT NULL,
	`total` integer NOT NULL,
	`notes` text NOT NULL,
	`status` text DEFAULT 'awaiting_whatsapp_confirmation' NOT NULL,
	`created_at` text NOT NULL
);
