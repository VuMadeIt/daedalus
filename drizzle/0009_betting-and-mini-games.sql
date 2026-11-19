CREATE TABLE "betMarket" (
	"id" text PRIMARY KEY NOT NULL,
	"question" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'open' NOT NULL,
	"outcome" text,
	"closesAt" timestamp,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"resolvedAt" timestamp,
	"createdBy" text
);
--> statement-breakpoint
CREATE TABLE "bet" (
	"id" text PRIMARY KEY NOT NULL,
	"marketId" text NOT NULL,
	"userId" text NOT NULL,
	"side" text NOT NULL,
	"amount" integer NOT NULL,
	"payout" integer,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "miniGamePlay" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"game" text NOT NULL,
	"stake" integer NOT NULL,
	"won" boolean NOT NULL,
	"delta" integer NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "betMarket" ADD CONSTRAINT "betMarket_createdBy_user_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bet" ADD CONSTRAINT "bet_marketId_betMarket_id_fk" FOREIGN KEY ("marketId") REFERENCES "public"."betMarket"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bet" ADD CONSTRAINT "bet_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "miniGamePlay" ADD CONSTRAINT "miniGamePlay_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;