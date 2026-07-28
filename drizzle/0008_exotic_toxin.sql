ALTER TABLE `creator_profiles` ADD `location_scope` text DEFAULT 'china' NOT NULL;--> statement-breakpoint
ALTER TABLE `creator_profiles` ADD `province` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `creator_profiles` ADD `country` text DEFAULT '' NOT NULL;