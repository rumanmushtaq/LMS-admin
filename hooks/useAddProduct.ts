import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productSchema, ProductFormData } from "../schemas/product";
import adminService from "../services/admin";

export const useAddProduct = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const productId = router.query.id as string | undefined;
  const isEditing = !!productId;
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
      price: 1,
      images: [{ file: null }],
      sizes: [{ value: "" }],
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

  const productQuery = useQuery({
    queryKey: ["admin-product", productId],
    queryFn: async () => {
      const response = await adminService.getProductById(productId as string);
      return response && response.success && response.data ? response.data : null;
    },
    enabled: isEditing,
    // A focus/reconnect refetch with changed data would reset the form mid-edit.
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const product = productQuery.data;

  // Fill the form once per product: a later cache update must not wipe edits.
  const filledForId = useRef<string | null>(null);
  useEffect(() => {
    if (!product || filledForId.current === productId) return;
    filledForId.current = productId as string;
    reset({
      title: product.title,
      price: product.price,
      description: product.description || "",
      images: product.images.map((img: string) => ({
        preview: img,
      })),
      sizes: product.sizes.map((s: string) => ({
        value: s,
      })),
    });
  }, [product, productId, reset]);

  useEffect(() => {
    if (productQuery.error) {
      console.error("Error fetching product:", productQuery.error);
    }
  }, [productQuery.error]);

  const saveMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const imageUrls: string[] = [];

      for (const img of data.images) {
        if (img.file) {
          console.log("Uploading image...");
          const uploadRes = await adminService.uploadImage(img.file);
          const finalUrl = uploadRes.data?.url || uploadRes.url;
          if (finalUrl) {
            imageUrls.push(finalUrl);
          }
        } else if (img.preview) {
          imageUrls.push(img.preview);
        }
      }

      const productData = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        sizes: data.sizes.map((s) => s.value).filter(Boolean),
        images: imageUrls,
      };

      console.log("Saving product data:", productData);

      if (isEditing) {
        return adminService.updateProduct(productId as string, productData);
      }
      return adminService.createProduct(productData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      if (isEditing) {
        queryClient.invalidateQueries({ queryKey: ["admin-product", productId] });
        router.push("/shop");
      } else {
        setIsSuccessModalOpen(true);
      }
    },
    onError: (error) => {
      console.error("Error submitting product:", error);
      alert("Failed to save product. Please try again.");
    },
  });

  const onFormSubmit: SubmitHandler<ProductFormData> = async (data) => {
    console.log("Form submitted with data:", data);
    console.log("Image fields:", imageFields);
    console.log("Size fields:", sizeFields);
    try {
      await saveMutation.mutateAsync(data);
    } catch {
      // Already reported in onError.
    }
  };

  const handleCreateAnother = () => {
    reset({
      title: "",
      description: "",
      price: 1,
      images: [{ file: null }],
      sizes: [{ value: "" }],
    });
    setIsSuccessModalOpen(false);
  };

  const handleGoToList = () => {
    router.push("/shop");
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors);
    }
  }, [errors]);

  const handleFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      updateImage(index, { file, preview: base64String });
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  return {
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
    MAX_ITEMS: 4,
  };
};
