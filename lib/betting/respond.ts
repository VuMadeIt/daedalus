import { NextResponse } from "next/server";
import { z } from "zod";

import { LedgerError } from "./ledger";

export function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message, error: message }, { status });
}

export function handleError(error: unknown, label: string) {
  if (error instanceof LedgerError) return fail(error.message, error.status);
  if (error instanceof z.ZodError) return fail(error.errors[0]?.message ?? "Invalid request");
  console.error(label, error);
  return fail("Something went wrong. Try again.", 500);
}
