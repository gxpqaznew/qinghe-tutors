CREATE TABLE `creator_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`creator_profile_id` integer NOT NULL,
	`reviewer_name` text NOT NULL,
	`reviewer_university` text DEFAULT '' NOT NULL,
	`rating` integer NOT NULL,
	`content` text NOT NULL,
	`contact` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
