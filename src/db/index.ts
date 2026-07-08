import { environment } from "@/configs/environment";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(environment.DATABASE_URL!, { prepare: false });

export const db = drizzle({ client });
