ALTER TABLE `parent_needs` ADD `fast_match` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `teacher_applications` ADD `gender` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `teacher_applications` ADD `education` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `teacher_applications` ADD `teaching_experience` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `teacher_applications` ADD `demo_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `teacher_applications` ADD `contact` text DEFAULT '' NOT NULL;