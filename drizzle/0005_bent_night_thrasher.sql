CREATE TABLE `creator_media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`creator_profile_id` integer NOT NULL,
	`object_key` text NOT NULL,
	`file_name` text NOT NULL,
	`content_type` text NOT NULL,
	`media_type` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
