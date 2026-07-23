CREATE TABLE `parent_needs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`grade_subject` text NOT NULL,
	`area` text NOT NULL,
	`schedule` text NOT NULL,
	`budget` text NOT NULL,
	`description` text NOT NULL,
	`contact` text NOT NULL,
	`payment_status` text DEFAULT 'awaiting_payment' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `teacher_applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`city` text NOT NULL,
	`subject` text NOT NULL,
	`school` text NOT NULL,
	`degree` text NOT NULL,
	`teaching_mode` text NOT NULL,
	`class_size` text DEFAULT '' NOT NULL,
	`rate` text NOT NULL,
	`introduction` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
