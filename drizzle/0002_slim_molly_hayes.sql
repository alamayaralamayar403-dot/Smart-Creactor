CREATE TABLE `activationCodes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`customerId` int,
	`orderId` int,
	`email` varchar(320) NOT NULL,
	`status` enum('unused','used','expired','revoked') NOT NULL DEFAULT 'unused',
	`usedAt` timestamp,
	`expiresAt` timestamp,
	`deviceId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `activationCodes_id` PRIMARY KEY(`id`),
	CONSTRAINT `activationCodes_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `emailLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`recipientEmail` varchar(320) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`type` enum('activation_code','welcome','support','notification') NOT NULL,
	`status` enum('sent','failed','bounced') NOT NULL DEFAULT 'sent',
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `emailLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `salesWebhooks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`webhookId` varchar(255) NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`customerId` int,
	`orderId` int,
	`payload` text NOT NULL,
	`status` enum('pending','processed','failed') NOT NULL DEFAULT 'pending',
	`errorMessage` text,
	`processedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `salesWebhooks_id` PRIMARY KEY(`id`),
	CONSTRAINT `salesWebhooks_webhookId_unique` UNIQUE(`webhookId`)
);
--> statement-breakpoint
ALTER TABLE `activationCodes` ADD CONSTRAINT `activationCodes_customerId_customers_id_fk` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activationCodes` ADD CONSTRAINT `activationCodes_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salesWebhooks` ADD CONSTRAINT `salesWebhooks_customerId_customers_id_fk` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `salesWebhooks` ADD CONSTRAINT `salesWebhooks_orderId_orders_id_fk` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE no action ON UPDATE no action;