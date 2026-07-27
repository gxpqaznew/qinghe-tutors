CREATE TABLE `creator_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`city` text NOT NULL,
	`university` text NOT NULL,
	`major_grade` text NOT NULL,
	`skill` text NOT NULL,
	`mode` text NOT NULL,
	`service_intro` text NOT NULL,
	`work_url` text DEFAULT '' NOT NULL,
	`contact` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `experience_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_name` text NOT NULL,
	`university` text NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`source_url` text DEFAULT '' NOT NULL,
	`summary` text NOT NULL,
	`content` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `skill_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`mode` text NOT NULL,
	`budget` text NOT NULL,
	`deadline` text NOT NULL,
	`description` text NOT NULL,
	`contact` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
