import {
  Button,
  Card,
  Input,
  Image as NextUIImage,
  Text,
} from "@nextui-org/react";
import { ArrowLeft, Package, Plus, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { Box } from "../styles/box";
import { Flex } from "../styles/flex";
import {
  useForm,
  Controller,
  useFieldArray,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const MAX_ITEMS = 4;

const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description is too short")
    .refine((val) => val !== "<p><br></p>", "Description is required"),
  price: z.coerce.number().min(0.01, "Price must be at least 0.01"),
  images: z
    .array(
      z.object({
        id: z.number(),
        file: z.any().optional(),
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
        id: z.number(),
        value: z.string().min(1, "Size cannot be empty"),
      }),
    )
    .min(1, "At least one size variant is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

type FieldsetProps = {
  label: string;
  children: React.ReactNode;
};

const Fieldset = ({ label, children }: FieldsetProps) => (
  <Card
    css={{
      p: "$10",
      mb: "$10",
      borderRadius: "$xl",
      border: "1px solid #f1f5f9",
      boxShadow:
        "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
      overflow: "visible",
      w: "100%",
    }}
  >
    <Text
      h4
      css={{
        mb: "$8",
        color: "$accents9",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        fontSize: "$xs",
        fontWeight: "$bold",
      }}
    >
      {label}
    </Text>
    {children}
  </Card>
);

const AddProduct = () => {
  const router = useRouter();
  const isEditing = !!router.query.id;

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      images: [{ id: 1 }, { id: 2 }],
      sizes: [
        { id: 1, value: "" },
        { id: 2, value: "" },
      ],
    },
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImageSlots,
    update: updateImage,
  } = useFieldArray({
    control,
    name: "images",
  });

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: "sizes",
  });

  useEffect(() => {
    if (router.query.id) {
      const stored = JSON.parse(localStorage.getItem("shop_products") || "[]");
      const product = stored.find((p: any) => p.id === Number(router.query.id));
      if (product) {
        reset({
          title: product.title,
          price: product.price,
          description: product.description || "",
          images: [{ id: 1, preview: product.image }, { id: 2 }],
          sizes: product.sizes.map((s: string, i: number) => ({
            id: i + 1,
            value: s,
          })),
        });
      }
    }
  }, [router.query.id, reset]);

  const onFormSubmit: SubmitHandler<ProductFormData> = (data) => {
    const stored = JSON.parse(localStorage.getItem("shop_products") || "[]");
    let updatedProducts = [...stored];

    const productData = {
      id: isEditing
        ? Number(router.query.id)
        : stored.length > 0
          ? Math.max(...stored.map((p: any) => p.id)) + 1
          : 1,
      image:
        data.images.find((img) => img.preview)?.preview ||
        "/images/tshirt-black.png",
      title: data.title,
      description: data.description,
      price: Number(data.price),
      sizes: data.sizes.map((s) => s.value),
      status: true,
    };

    if (isEditing) {
      updatedProducts = updatedProducts.map((p: any) =>
        p.id === productData.id ? productData : p,
      );
    } else {
      updatedProducts.push(productData);
    }

    localStorage.setItem("shop_products", JSON.stringify(updatedProducts));
    router.push("/shop");
  };

  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const handleFileChange = (
    index: number,
    id: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateImage(index, { id, file, preview: base64String });
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  return (
    <Box css={{ bg: "#f8fafc", minHeight: "100vh" }}>
      <Flex
        css={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bg: "rgba(248, 250, 252, 0.8)",
          borderBottom: "1px solid #e2e8f0",
          p: "$4",
          px: "$12",
          gap: "$6",
          mb: "$8",
          backdropFilter: "blur(12px)",
        }}
        align="center"
        justify="between"
      >
        <Flex align="center" css={{ gap: "$6" }}>
          <Button
            auto
            light
            icon={<ArrowLeft size={20} />}
            onPress={() => router.back()}
            css={{ minWidth: "40px", height: "40px", padding: 0 }}
          />
          <Flex align="center" css={{ gap: "$4" }}>
            <Box
              css={{
                bg: "$primaryLight",
                p: "$3",
                borderRadius: "$md",
                color: "$primary",
              }}
            >
              <Package size={20} />
            </Box>
            <Text h3 css={{ m: 0, fontSize: "$xl" }}>
              {isEditing ? "Edit Product" : "Add New Product"}
            </Text>
          </Flex>
        </Flex>

        <Flex css={{ gap: "$4" }}>
          <Button
            auto
            flat
            color="secondary"
            css={{ px: "$10" }}
            onPress={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            auto
            css={{
              bg: "#7047EB",
              color: "$white",
              px: "$10",
              fontWeight: "$bold",
            }}
            onPress={(() => handleSubmit(onFormSubmit)()) as any}
          >
            {isEditing ? "Update Product" : "Create Product"}
          </Button>
        </Flex>
      </Flex>

      <Box css={{ maxWidth: "1400px", margin: "0 auto", px: "$12", pb: "$12" }}>
        <Flex
          css={{ gap: "$10", flexWrap: "wrap", "@md": { flexWrap: "nowrap" } }}
          align="start"
        >
          {/* Main Column */}
          <Box css={{ flex: "1 1 65%", minWidth: "300px" }}>
            <Fieldset label="General Information">
              <Flex direction="column" css={{ gap: "$8" }}>
                <Box>
                  <Text
                    span
                    size="$sm"
                    css={{ color: "$accents7", mb: "$2", display: "block" }}
                  >
                    Product Title
                  </Text>
                  <Input
                    placeholder="e.g. Premium Cotton T-Shirt"
                    fullWidth
                    bordered
                    size="lg"
                    status={errors.title ? "error" : "default"}
                    helperText={errors.title?.message}
                    css={{ "& .nextui-input-wrapper": { borderRadius: "$md" } }}
                    {...register("title")}
                  />
                </Box>

                <Box>
                  <Text
                    span
                    size="$sm"
                    css={{ color: "$accents7", mb: "$2", display: "block" }}
                  >
                    Description
                  </Text>
                  <Box
                    css={{
                      border: errors.description ? "2px solid #f31260" : "none",
                      borderRadius: "$md",
                      "& .quill": { bg: "$white", borderRadius: "$md" },
                      "& .ql-container.ql-snow": {
                        border: "1px solid #e2e8f0",
                        borderBottomLeftRadius: "$md",
                        borderBottomRightRadius: "$md",
                        minHeight: "300px",
                      },
                      "& .ql-toolbar.ql-snow": {
                        border: "1px solid #e2e8f0",
                        borderTopLeftRadius: "$md",
                        borderTopRightRadius: "$md",
                        borderBottom: "none",
                        bg: "#f1f5f9",
                      },
                    }}
                  >
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Enter comprehensive product description here..."
                        />
                      )}
                    />
                  </Box>
                  {errors.description && (
                    <Text size="$xs" color="error" css={{ mt: "$2" }}>
                      {errors.description.message}
                    </Text>
                  )}
                </Box>
              </Flex>
            </Fieldset>

            <Fieldset label="Product Images">
              <Flex direction="column" css={{ gap: "$4" }}>
                <Flex css={{ gap: "$6", width: "100%", flexWrap: "wrap" }}>
                  {imageFields.map((field, index) => (
                    <Flex
                      key={field.id}
                      direction="column"
                      css={{ position: "relative" }}
                    >
                      {field.preview ? (
                        <Box
                          css={{
                            position: "relative",
                            width: "180px",
                            height: "240px",
                            borderRadius: "$xl",
                            overflow: "hidden",
                            border: "1px solid #e2e8f0",
                            boxShadow: "$sm",
                          }}
                        >
                          <NextUIImage
                            src={field.preview}
                            alt="preview"
                            width="100%"
                            height="100%"
                            objectFit="cover"
                          />
                          <Button
                            auto
                            color="error"
                            css={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              minWidth: "28px",
                              height: "28px",
                              padding: 0,
                              borderRadius: "50%",
                              zIndex: 10,
                            }}
                            onPress={() => updateImage(index, { id: field.id })}
                          >
                            <X size={14} />
                          </Button>
                        </Box>
                      ) : (
                        <Button
                          auto
                          light
                          css={{
                            border: "2px dashed #cbd5e1",
                            width: "180px",
                            height: "240px",
                            borderRadius: "$xl",
                            background: "#f8fafc",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bg: "#f1f5f9",
                              borderColor: "#7047EB",
                            },
                          }}
                          onPress={() =>
                            fileInputRefs.current[field.id]?.click()
                          }
                        >
                          <Flex
                            direction="column"
                            align="center"
                            css={{ gap: "$2" }}
                          >
                            <Plus size={24} color="#94a3b8" />
                            <Text size="$xs" css={{ color: "#94a3b8" }}>
                              Upload Image {index + 1}
                            </Text>
                          </Flex>
                        </Button>
                      )}

                      <input
                        type="file"
                        ref={(el) => (fileInputRefs.current[field.id] = el)}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={(e) => handleFileChange(index, field.id, e)}
                      />
                    </Flex>
                  ))}

                  {imageFields.length < MAX_ITEMS && (
                    <Button
                      auto
                      flat
                      color="secondary"
                      icon={<Plus size={20} />}
                      onPress={() => appendImage({ id: Date.now() })}
                      css={{
                        width: "180px",
                        height: "240px",
                        borderRadius: "$xl",
                        bg: "$primaryLight",
                      }}
                    >
                      Add Slot
                    </Button>
                  )}
                </Flex>
                {errors.images && (
                  <Text color="error" size="$xs">
                    {errors.images.message}
                  </Text>
                )}
              </Flex>
            </Fieldset>
          </Box>

          {/* Sidebar Column */}
          <Box
            css={{
              flex: "1 1 35%",
              minWidth: "300px",
              position: "sticky",
              top: "100px",
            }}
          >
            <Fieldset label="Pricing">
              <Box>
                <Text
                  span
                  size="$sm"
                  css={{ color: "$accents7", mb: "$2", display: "block" }}
                >
                  Base Price
                </Text>
                <Input
                  type="number"
                  fullWidth
                  bordered
                  size="lg"
                  labelLeft="$"
                  status={errors.price ? "error" : "default"}
                  helperText={errors.price?.message}
                  css={{ "& .nextui-input-wrapper": { borderRadius: "$md" } }}
                  {...register("price")}
                />
              </Box>
            </Fieldset>

            <Fieldset label="Inventory & Sizes">
              <Flex direction="column" css={{ gap: "$4" }}>
                <Text
                  span
                  size="$sm"
                  css={{ color: "$accents7", mb: "$2", display: "block" }}
                >
                  Available Sizes
                </Text>
                {sizeFields.map((field, index) => (
                  <Flex key={field.id} align="center" css={{ gap: "$3" }}>
                    <Input
                      bordered
                      fullWidth
                      size="md"
                      placeholder="e.g. XL, Medium..."
                      status={errors.sizes?.[index] ? "error" : "default"}
                      helperText={errors.sizes?.[index]?.value?.message}
                      css={{
                        "& .nextui-input-wrapper": { borderRadius: "$md" },
                      }}
                      {...register(`sizes.${index}.value` as const)}
                    />
                    <Button
                      auto
                      flat
                      color="error"
                      icon={<X size={16} color="#f43f5e" />}
                      css={{
                        bg: "$dangerLight",
                        minWidth: "32px",
                        height: "32px",
                        padding: 0,
                      }}
                      onPress={() => removeSize(index)}
                    />
                  </Flex>
                ))}

                {sizeFields.length < MAX_ITEMS && (
                  <Button
                    auto
                    flat
                    color="secondary"
                    icon={<Plus size={16} />}
                    onPress={() => appendSize({ id: Date.now(), value: "" })}
                    css={{ width: "100%", mt: "$4", borderRadius: "$md" }}
                  >
                    Add Size Variant
                  </Button>
                )}
                {errors.sizes && (
                  <Text color="error" size="$xs">
                    {errors.sizes.root?.message || errors.sizes.message}
                  </Text>
                )}
              </Flex>
            </Fieldset>

            <Card
              css={{
                bg: "$primaryLight",
                p: "$8",
                borderRadius: "$xl",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                css={{
                  position: "absolute",
                  right: "-20px",
                  top: "-10px",
                  opacity: 0.1,
                  color: "$primary",
                }}
              >
                <Package size={120} />
              </Box>
              <Text h4 css={{ mb: "$2" }}>
                Ready to publish?
              </Text>
              <Text size="$sm" css={{ color: "$accents8", mb: "$6" }}>
                Verify all details before submitting. You can always edit the
                product later.
              </Text>
              <Button
                css={{
                  bg: "#7047EB",
                  color: "$white",
                  fontWeight: "$bold",
                  height: "48px",
                  width: "100%",
                }}
                onPress={(() => handleSubmit(onFormSubmit)()) as any}
              >
                {isEditing ? "Save Changes" : "Publish Product"}
              </Button>
            </Card>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default AddProduct;
