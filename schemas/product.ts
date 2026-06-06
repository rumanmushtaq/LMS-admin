import * as z from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description is too short")
    .refine((val) => val !== "<p><br></p>", "Description is required"),
  price: z.coerce.number().min(0.01, "Price must be at least 0.01"),
  images: z
    .array(
      z.object({
        file: z.any().optional().nullable(),
        preview: z.string().optional(),
      }),
    )
    .min(1, "At least one identity/image slot is required")
    .refine(
      (imgs) => imgs.some((img) => img.preview),
      "At least one image is required",
    ),
  sizes: z
    .array(
      z.object({
        value: z.string().min(1, "Size cannot be empty"),
      }),
    )
    .min(1, "At least one size variant is required"),
});

export type ProductFormData = z.infer<typeof productSchema>;
