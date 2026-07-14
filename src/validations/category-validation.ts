import * as z from "zod";

export const categorySchema = z.object({
  type: z.enum(["income", "expense"], { error: "Type must be selected" }),
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
});

export type Category = z.infer<typeof categorySchema> & { id: string };
