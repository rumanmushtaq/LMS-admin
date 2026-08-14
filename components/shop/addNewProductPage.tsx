import {
  Button,
  Card,
  Input,
  Image as NextUIImage,
  Text,
} from "@nextui-org/react";
import { ArrowLeft, Package, Plus, X } from "lucide-react";
import dynamic from "next/dynamic";
import { Controller } from "react-hook-form";
import { Box } from "../styles/box";
import { Flex } from "../styles/flex";
import { useAddProduct } from "../../hooks/useAddProduct";
import { SuccessModal } from "./SuccessModal";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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
  const {
    router,
    isEditing,
    register,
    control,
    handleSubmit,
    errors,
    imageFields,
    appendImage,
    updateImage,
    sizeFields,
    appendSize,
    removeSize,
    onFormSubmit,
    handleFileChange,
    fileInputRefs,
    isSuccessModalOpen,
    setIsSuccessModalOpen,
    handleCreateAnother,
    handleGoToList,
    MAX_ITEMS,
  } = useAddProduct();

  return (
    <Box css={{ bg: "#f8fafc", minHeight: "100vh" }}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <Flex
          css={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            bg: "rgba(248, 250, 252, 0.8)",
            borderBottom: "1px solid #e2e8f0",
            p: "$4",
            px: "$6",
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
              type="submit"
              css={{
                bg: "#7047EB",
                color: "$white",
                px: "$10",
                fontWeight: "$bold",
              }}
            >
              {isEditing ? "Update Product" : "Create Product"}
            </Button>
          </Flex>
        </Flex>

        <Box css={{ px: "$6", pb: "$12" }}>
          <Flex
            css={{
              gap: "$10",
              flexWrap: "wrap",
              "@md": { flexWrap: "nowrap" },
            }}
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
                      css={{
                        "& .nextui-input-wrapper": { borderRadius: "$md" },
                      }}
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
                        border: errors.description
                          ? "2px solid #f31260"
                          : "none",
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
                    {imageFields?.map((field, index) => (
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
                              onPress={() => updateImage(index, {})}
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
                          onChange={(e) => handleFileChange(index, e)}
                        />
                      </Flex>
                    ))}

                    {imageFields.length < MAX_ITEMS && (
                      <Button
                        auto
                        flat
                        color="secondary"
                        icon={<Plus size={20} />}
                        onPress={() => appendImage({})}
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
                      onPress={() => appendSize({ value: "" })}
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
      </form>

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onCreateAnother={handleCreateAnother}
        onGoToList={handleGoToList}
      />
    </Box>
  );
};

export default AddProduct;
