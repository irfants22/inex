import { CATEGORY_COLOR_NAMES, CATEGORY_ICON_NAMES } from "@/constants/icon";
import * as z from "zod";

export const categorySchema = z.object({
  type: z.enum(["income", "expense"], { error: "Type must be selected" }),
  name: z.string().min(1, "Name is required"),
  color: z.string().min(1, "Color is required"),
  icon: z.string().min(1, "Icon is required"),
});

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  type: z
    .union([z.literal(""), z.enum(["income", "expense"])])
    .refine((value) => value !== "", {
      message: "Type must be selected",
    }),
  color: z.enum(CATEGORY_COLOR_NAMES as [string, ...string[]], {
    error: "Color must be selected",
  }),
  icon: z.enum(CATEGORY_ICON_NAMES as [string, ...string[]], {
    error: "Icon must be selected",
  }),
});

export type Category = z.infer<typeof categorySchema> & { id: string };
export type CategoryFormInput = z.input<typeof categoryFormSchema>;
