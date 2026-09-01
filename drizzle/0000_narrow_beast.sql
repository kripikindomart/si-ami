CREATE TYPE "public"."status" AS ENUM('aktif', 'nonaktif');--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role_id" uuid NOT NULL,
	"modul" varchar(50) NOT NULL,
	"can_create" boolean DEFAULT false NOT NULL,
	"can_read" boolean DEFAULT false NOT NULL,
	"can_update" boolean DEFAULT false NOT NULL,
	"can_delete" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_role_modul" UNIQUE("role_id","modul")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" varchar(50) NOT NULL,
	"deskripsi" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "roles_nama_unique" UNIQUE("nama")
);
--> statement-breakpoint
CREATE TABLE "user_unit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"unit_kerja_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "unique_user_unit" UNIQUE("user_id","unit_kerja_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nama" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role_id" uuid NOT NULL,
	"status" "status" DEFAULT 'aktif' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_unit" ADD CONSTRAINT "user_unit_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_permissions_role" ON "permissions" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "idx_permissions_modul" ON "permissions" USING btree ("modul");--> statement-breakpoint
CREATE INDEX "idx_user_unit_user" ON "user_unit" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_unit_unit" ON "user_unit" USING btree ("unit_kerja_id");--> statement-breakpoint
CREATE INDEX "idx_users_role" ON "users" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "idx_users_status" ON "users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");