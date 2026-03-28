import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  ArrowLeft, Plus, X, Bold, Italic, Link, Image as ImageIcon,
  Code, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Undo2, Redo2, Underline, Strikethrough, Package
} from "lucide-react";
import { Input, Button, Text, Card } from "@nextui-org/react";
import { Flex } from "../styles/flex";
import { Box } from "../styles/box";

const MAX_ITEMS = 4;

type FieldsetProps = {
  label: string;
  children: React.ReactNode;
};

const Fieldset = ({ label, children }: FieldsetProps) => (
  <Card css={{ p: "$8", mb: "$8", overflow: 'visible', w: '100%' }}>
    <Text h4 css={{ mb: "$6", color: "$accents8", textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '$sm' }}>
      {label}
    </Text>
    {children}
  </Card>
);

const TOOLBAR_GROUPS = [
  [
    { icon: Undo2, label: "Undo", command: "undo" },
    { icon: Redo2, label: "Redo", command: "redo" },
  ],
  [
    { icon: Bold, label: "Bold", command: "bold" },
    { icon: Italic, label: "Italic", command: "italic" },
    { icon: Underline, label: "Underline", command: "underline" },
    { icon: Strikethrough, label: "Strikethrough", command: "strikeThrough" },
  ],
  [
    { icon: Link, label: "Link", command: "createLink" },
    { icon: ImageIcon, label: "Image", command: "insertImage" },
    { icon: Code, label: "Code", command: "formatBlock_pre" },
  ],
  [
    { icon: List, label: "Bullet List", command: "insertUnorderedList" },
    { icon: ListOrdered, label: "Ordered List", command: "insertOrderedList" },
  ],
  [
    { icon: AlignLeft, label: "Left", command: "justifyLeft" },
    { icon: AlignCenter, label: "Center", command: "justifyCenter" },
    { icon: AlignRight, label: "Right", command: "justifyRight" },
  ],
];

const AddProduct = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<{ id: number; file?: File; preview?: string }[]>([
    { id: 1 }, { id: 2 },
  ]);
  const [sizes, setSizes] = useState<{ id: number; value: string }[]>([
    { id: 1, value: "" },
    { id: 2, value: "" },
  ]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Pre-fill form if Edit ID exists in Pages Router
  useEffect(() => {
    if (router.query.id) {
      setIsEditing(true);
      const stored = JSON.parse(localStorage.getItem('shop_products') || '[]');
      const product = stored.find((p: any) => p.id === Number(router.query.id));
      if (product) {
        setTitle(product.title);
        setPrice(product.price.toString());
        if (editorRef.current) {
           editorRef.current.innerHTML = product.description;
        }
        setImages([
           { id: 1, preview: product.image },
           { id: 2 }
        ]);
        setSizes(product.sizes.map((s: string, i: number) => ({ id: i + 1, value: s })));
      }
    }
  }, [router.query.id]);

  const handleSubmit = () => {
    setErrorMsg("");
    if (!title.trim()) return setErrorMsg("Product Title is required.");
    if (!price || Number(price) <= 0) return setErrorMsg("A valid Price is required.");
    const rawDesc = editorRef.current?.innerText?.trim();
    if (!rawDesc) return setErrorMsg("Product Description is required.");
    
    const activeSizes = sizes.filter(s => s.value.trim() !== "").map(s => s.value.trim());
    if (activeSizes.length === 0) return setErrorMsg("Please select at least one shirt size.");

    const hasImages = images.some(img => img.preview);
    if (!hasImages) return setErrorMsg("At least one product image is required.");

    const stored = JSON.parse(localStorage.getItem('shop_products') || '[]');
    let updatedProducts = [...stored];
    
    const productData = {
      id: isEditing ? Number(router.query.id) : (stored.length > 0 ? Math.max(...stored.map((p: any) => p.id)) + 1 : 1),
      image: images.find(img => img.preview)?.preview || "/images/tshirt-black.png",
      title,
      description: editorRef.current?.innerHTML || "",
      price: Number(price),
      sizes: activeSizes,
      status: true
    };

    if (isEditing) {
      updatedProducts = updatedProducts.map((p: any) => p.id === productData.id ? productData : p);
    } else {
      updatedProducts.push(productData);
    }

    localStorage.setItem('shop_products', JSON.stringify(updatedProducts));
    router.push('/shop');
  };

  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string) => {
    // DO NOT invoke editorRef.current?.focus() here, otherwise it drops the user's highlighted selection!

    if (command === "createLink") {
      const url = prompt("Enter URL:");
      if (url) document.execCommand("createLink", false, url);
      return;
    }

    if (command === "insertImage") {
      const url = prompt("Enter image URL:");
      if (url) document.execCommand("insertImage", false, url);
      return;
    }

    if (command.startsWith("formatBlock_")) {
      document.execCommand("formatBlock", false, command.split("_")[1]);
      return;
    }

    document.execCommand(command, false);
  }, []);

  const handleFileChange = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file strictly to Base64 so it securely persists in LocalStorage across page reloads
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, file, preview: base64String } : img))
      );
    };
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const removeImage = (id: number) =>
    setImages((prev) => prev.filter((i) => i.id !== id));

  const addImage = () => {
    if (images.length >= MAX_ITEMS) return;
    setImages((prev) => [...prev, { id: Date.now() }]);
  };

  const removeSize = (id: number) =>
    setSizes((prev) => prev.filter((s) => s.id !== id));

  const addSize = () => {
    if (sizes.length >= MAX_ITEMS) return;
    setSizes((prev) => [...prev, { id: Date.now(), value: "" }]);
  };

  const updateSize = (id: number, v: string) =>
    setSizes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value: v } : s))
    );

  return (
    <Box css={{ bg: "$background" }}>
      {/* Header */}
      <Flex css={{ position: 'sticky', top: 0, zIndex: 10, bg: '$background', borderBottom: '1px solid $border', p: '$4', px: '$8', gap: '$6', mb: '$8', backdropFilter: 'blur(8px)' }} align="center">
        <Button auto light icon={<ArrowLeft size={20} />} onPress={() => router.back()} css={{ minWidth: "40px", height: "40px", padding: 0 }} />
        <Flex align="center" css={{ gap: '$4' }}>
           <Box css={{ bg: '$primaryLight', p: '$4', borderRadius: '$md', color: '$primary' }}>
              <Package size={20} />
           </Box>
           <Text h3 css={{ m: 0 }}>Add / Edit Product</Text>
        </Flex>
      </Flex>

      <Box css={{ maxWidth: "800px", margin: "0 auto", px: "$6", pb: "$12" }}>
        {/* Title */}
        <Fieldset label="Product Title">
          <Input
            placeholder="e.g. Premium Cotton T-Shirt"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            bordered
            size="lg"
          />
        </Fieldset>

        {/* Description */}
        <Fieldset label="Description">
          <Flex wrap="wrap" align="center" css={{ border: "1px solid $border", p: "$2", gap: "$4", borderRadius: "$md", mb: "$4" }}>
            {TOOLBAR_GROUPS.map((group, gi) => (
              <Flex key={gi} align="center" css={{ gap: "$2", borderRight: gi !== TOOLBAR_GROUPS.length - 1 ? "1px solid $border" : "none", pr: "$4" }}>
                {group.map((btn) => (
                  <Button
                    key={btn.command}
                    auto
                    light
                    color="secondary"
                    onMouseDown={(e: any) => {
                      e.preventDefault();
                      execCommand(btn.command);
                    }}
                    icon={<btn.icon size={16} />}
                    css={{ minWidth: "32px", height: "32px", padding: 0 }}
                  />
                ))}
              </Flex>
            ))}
          </Flex>

          <Box
            ref={editorRef}
            contentEditable
            data-placeholder="Enter comprehensive product description here..."
            css={{ minHeight: "150px", border: "1px solid $border", p: "$6", borderRadius: "$md", outline: "none", '&:focus': { borderColor: '$primary' }, '&[contenteditable]:empty::before': { content: 'attr(data-placeholder)', color: '$accents6', pointerEvents: 'none' } }}
          />
        </Fieldset>

        {/* Price */}
        <Fieldset label="Price">
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            bordered
            size="lg"
            labelLeft="$"
          />
        </Fieldset>

        {/* Images */}
        <Fieldset label="Product Images">
          <Flex css={{ gap: '$8', width: '100%', flexWrap: 'wrap' }}>
            {images.map((img, index) => (
               <Flex key={img.id} direction="column" css={{ position: 'relative' }}>
                  {img.preview ? (
                     <Box css={{ position: 'relative', width: '200px', height: '260px', borderRadius: '$md', overflow: 'hidden', border: '1px solid $border' }}>
                        <img src={img.preview} alt="preview" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                        <Button
                           auto
                           color="error"
                           css={{ position: 'absolute', top: 8, right: 8, minWidth: '28px', height: '28px', padding: 0, borderRadius: '50%' }}
                           onPress={() => setImages((prev) => prev.map((i) => (i.id === img.id ? { id: i.id } : i)))}
                        >
                           ×
                        </Button>
                     </Box>
                  ) : (
                     <Button auto light css={{ border: '2px dashed $border', width: '200px', height: '260px', borderRadius: '$md', background: '$accents1' }} onPress={() => fileInputRefs.current[img.id]?.click()}>
                        + Upload Image {index + 1}
                     </Button>
                  )}

                  <input
                    type="file"
                    ref={(el) => (fileInputRefs.current[img.id] = el)}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => handleFileChange(img.id, e)}
                  />
               </Flex>
            ))}
          </Flex>

          {images.length < MAX_ITEMS && (
            <Button auto flat color="secondary" icon={<Plus size={16} />} onPress={addImage}>
               Add Image Slot
            </Button>
          )}
        </Fieldset>

        {/* Sizes */}
        <Fieldset label="Sizes">
          {sizes.map((size) => (
            <Flex key={size.id} align="center" css={{ gap: "$4", mb: "$4" }}>
              <Input
                value={size.value}
                onChange={(e) => updateSize(size.id, e.target.value)}
                bordered
                fullWidth
                size="lg"
              />
              <Button auto flat color="error" icon={<X size={16} color="#f43f5e" />} css={{ bg: "$dangerLight", minWidth: "32px", height: "32px", padding: 0 }} onPress={() => removeSize(size.id)} />
            </Flex>
          ))}

          {sizes.length < MAX_ITEMS && (
            <Button auto flat color="secondary" icon={<Plus size={16} />} onPress={addSize}>
               Add Size
            </Button>
          )}
        </Fieldset>

        {/* Actions */}
        <Flex direction="column" css={{ gap: "$4", pt: "$8" }}>
          {errorMsg && (
            <Text color="error" css={{ fontWeight: 'bold' }}>{errorMsg}</Text>
          )}
          <Flex css={{ gap: "$4" }}>
            <Button auto css={{ bg: '#7047EB', color: '$white', px: '$12' }} onPress={handleSubmit}>
              Submit Product
            </Button>

            <Button auto flat color="secondary" css={{ px: '$12' }} onPress={() => router.back()}>
              Cancel
            </Button>
          </Flex>
        </Flex>

      </Box>
    </Box>
  );
};

export default AddProduct;