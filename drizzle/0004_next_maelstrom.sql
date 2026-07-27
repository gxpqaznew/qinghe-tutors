ALTER TABLE `creator_profiles` ADD `school_verification_status` text DEFAULT 'unverified' NOT NULL;--> statement-breakpoint
ALTER TABLE `skill_requests` ADD `university` text DEFAULT '' NOT NULL;