"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import slugify from "slugify";

import AdminBreadcrumb from "@/components/application/admin/breadcrumb";
import { MediaPickerModal } from "@/components/application/admin/media-picker-modal";
import { Button } from "@/components/ui/button";
import ADMIN_ROUTES from "@/routes/admin.routes";
import { productVariantFormSchema } from "@/validators/productVariant.validator";

// Chuyển media document sang định dạng picker
function mediaDocToPickerItem(doc) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const url =
    doc.secureUrl ||
    (doc.path
      ? `https://res.cloudinary.com/${cloud}/image/upload/${doc.path}`
      : "");
  return { _id: String(doc._id), url };
}

// Khởi tạo giá trị mặc định cho form
function buildDefaultsFromVariant(variant) {
  if (!variant) {
    return {
      color: "",
      discountPercent: 0,
      media: [],
      mrp: "",
      product: "",
      sellingPrice: "",
      size: "",
      sku: "",
    };
  }
  return {
    color: variant.color || "",
    discountPercent: variant.discountPercent ?? 0,
    media: (variant.media || []).map((m) => String(m._id)),
    mrp: String(variant.mrp ?? ""),
    product: String(variant.product?._id || variant.product || ""),
    sellingPrice: String(variant.sellingPrice ?? ""),
    size: variant.size || "",
    sku: variant.sku || "",
  };
}

// Tự sinh SKU từ tên sản phẩm, màu và kích cỡ
function buildSuggestedSku(productSlug, color, size) {
  const base = slugify(productSlug || "variant", {
    lower: true,
    strict: true,
    trim: true,
  });
  const c = String(color || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9-]/g, "");
  const s = String(size || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "-")
    .replace(/[^A-Z0-9-]/g, "");
  return [base, c, s].filter(Boolean).join("-").slice(0, 120);
}

// Form tạo/chỉnh sửa biến thể sản phẩm
export function VariantForm({ initialVariant }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = Boolean(initialVariant);
  const variantId = initialVariant?._id ? String(initialVariant._id) : "";
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState(() =>
    initialVariant
      ? (initialVariant.media || []).map(mediaDocToPickerItem)
      : [],
  );

  const { data: productsRes } = useQuery({
    queryFn: async () => {
      const params = new URLSearchParams({
        deleteType: "SD",
        filters: "[]",
        globalFilter: "",
        limit: "500",
        page: "1",
        sorting: JSON.stringify([{ desc: true, id: "createdAt" }]),
      });
      const r = await fetch(`/api/product/show?${params}`);
      const j = await r.json();
      if (!r.ok) {
        throw new Error(j.message);
      }
      return j;
    },
    queryKey: ["variant-form-products"],
  });

  const products = useMemo(() => productsRes?.data || [], [productsRes?.data]);

  const form = useForm({
    defaultValues: buildDefaultsFromVariant(initialVariant),
    resolver: zodResolver(productVariantFormSchema),
  });

  const { control, formState, handleSubmit, register, setValue } = form;

  const productIdWatch = useWatch({ control, name: "product" });
  const colorWatch = useWatch({ control, name: "color" });
  const sizeWatch = useWatch({ control, name: "size" });
  const mrpWatch = useWatch({ control, name: "mrp" });
  const sellingWatch = useWatch({ control, name: "sellingPrice" });

  // Sản phẩm đang chọn — dùng slug khi tự sinh SKU
  const selectedProduct = useMemo(
    () => products.find((p) => String(p._id) === String(productIdWatch)),
    [products, productIdWatch],
  );

  // Tự tính % giảm từ MRP và giá bán (giống product-form)
  useEffect(() => {
    const m =
      typeof mrpWatch === "number"
        ? mrpWatch
        : Number.parseFloat(String(mrpWatch));
    const s =
      typeof sellingWatch === "number"
        ? sellingWatch
        : Number.parseFloat(String(sellingWatch));
    if (m > 0 && s > 0 && s <= m) {
      const d = Math.round(((m - s) / m) * 100);
      setValue("discountPercent", d);
    }
  }, [mrpWatch, sellingWatch, setValue]);

  // Đồng bộ ID media từ picker vào form
  useEffect(() => {
    setValue(
      "media",
      mediaItems.map((m) => m._id),
    );
  }, [mediaItems, setValue]);

  const createMut = useMutation({
    mutationFn: async (payload) => {
      const r = await fetch("/api/product-variant/create", {
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const j = await r.json();
      if (!r.ok) {
        throw new Error(j.message);
      }
      return j;
    },
    onError: (e) => toast.error(e.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datatable"] });
      toast.success("Tạo biến thể thành công");
      router.push(ADMIN_ROUTES.VARIANT_SHOW);
    },
  });

  const updateMut = useMutation({
    mutationFn: async (payload) => {
      const r = await fetch(`/api/product-variant/edit/${variantId}`, {
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        method: "PUT",
      });
      const j = await r.json();
      if (!r.ok) {
        throw new Error(j.message);
      }
      return j;
    },
    onError: (e) => toast.error(e.message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["datatable"] });
      toast.success("Cập nhật biến thể thành công");
      router.push(ADMIN_ROUTES.VARIANT_SHOW);
    },
  });

  const onValid = (data) => {
    if (isEdit) {
      updateMut.mutate(data);
    } else {
      createMut.mutate(data);
    }
  };

  const pending = createMut.isPending || updateMut.isPending;

  // Gợi ý SKU: slug-sản-phẩm + màu + size (tối đa 120 ký tự)
  const applySuggestedSku = () => {
    const slug = selectedProduct?.slug || "variant";
    const next = buildSuggestedSku(slug, colorWatch, sizeWatch);
    if (next) {
      setValue("sku", next, { shouldValidate: true });
    }
  };

  const breadcrumbBase = [
    { href: ADMIN_ROUTES.DASHBOARD, label: "Bảng điều khiển" },
    { href: ADMIN_ROUTES.VARIANT_SHOW, label: "Biến thể" },
  ];

  return (
    <div className="p-5">
      <AdminBreadcrumb
        breadcrumbData={
          isEdit
            ? [...breadcrumbBase, { href: "#", label: "Chỉnh sửa" }]
            : [
                ...breadcrumbBase,
                { href: ADMIN_ROUTES.VARIANT_ADD, label: "Thêm biến thể" },
              ]
        }
      />
      <h1 className="mb-5 text-2xl font-bold">
        {isEdit ? "Chỉnh sửa biến thể" : "Thêm biến thể"}
      </h1>

      <form
        className="mx-auto max-w-3xl space-y-5"
        onSubmit={handleSubmit(onValid)}
      >
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="product">
            Sản phẩm
          </label>
          <select
            className="h-10 w-full rounded-md border bg-background px-3"
            id="product"
            {...register("product")}
          >
            <option value="">Chọn sản phẩm</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          {formState.errors.product ? (
            <p className="text-destructive mt-1 text-sm">
              {formState.errors.product.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="color">
              Màu
            </label>
            <input
              className="h-10 w-full rounded-md border px-3"
              id="color"
              {...register("color")}
            />
            {formState.errors.color ? (
              <p className="text-destructive mt-1 text-sm">
                {formState.errors.color.message}
              </p>
            ) : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="size">
              Kích cỡ
            </label>
            <input
              className="h-10 w-full rounded-md border px-3"
              id="size"
              {...register("size")}
            />
            {formState.errors.size ? (
              <p className="text-destructive mt-1 text-sm">
                {formState.errors.size.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium">SKU</span>
          <div className="flex flex-wrap gap-2">
            <input
              className="h-10 min-w-[200px] flex-1 rounded-md border px-3"
              id="sku"
              {...register("sku")}
            />
            <Button onClick={applySuggestedSku} type="button" variant="outline">
              Tự sinh SKU
            </Button>
          </div>
          {formState.errors.sku ? (
            <p className="text-destructive mt-1 text-sm">
              {formState.errors.sku.message}
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="mrp">
              Giá gốc (MRP)
            </label>
            <input
              className="h-10 w-full rounded-md border px-3"
              id="mrp"
              inputMode="decimal"
              step="any"
              type="number"
              {...register("mrp")}
            />
            {formState.errors.mrp ? (
              <p className="text-destructive mt-1 text-sm">
                {formState.errors.mrp.message}
              </p>
            ) : null}
          </div>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="sellingPrice"
            >
              Giá bán
            </label>
            <input
              className="h-10 w-full rounded-md border px-3"
              id="sellingPrice"
              inputMode="decimal"
              step="any"
              type="number"
              {...register("sellingPrice")}
            />
            {formState.errors.sellingPrice ? (
              <p className="text-destructive mt-1 text-sm">
                {formState.errors.sellingPrice.message}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium"
            htmlFor="discountPercent"
          >
            Giảm giá (%)
          </label>
          <input
            className="bg-muted/40 h-10 w-full cursor-not-allowed rounded-md border px-3"
            id="discountPercent"
            readOnly
            type="number"
            {...register("discountPercent", { valueAsNumber: true })}
          />
        </div>

        <div>
          <span className="mb-1 block text-sm font-medium">Hình ảnh</span>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setMediaOpen(true)}
              type="button"
              variant="outline"
            >
              Chọn media
            </Button>
            <span className="text-muted-foreground text-sm">
              Đã chọn {mediaItems.length} ảnh
            </span>
          </div>
          {mediaItems.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {mediaItems.map((item) => (
                <div
                  className="relative h-20 w-20 overflow-hidden rounded-md border"
                  key={item._id}
                >
                  {item.url ? (
                    <Image
                      alt=""
                      className="object-cover"
                      fill
                      sizes="80px"
                      src={item.url}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {formState.errors.media ? (
            <p className="text-destructive mt-1 text-sm">
              {formState.errors.media.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button disabled={pending} type="submit">
            {pending ? "Đang lưu..." : "Lưu"}
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href={ADMIN_ROUTES.VARIANT_SHOW}>Hủy</Link>
          </Button>
        </div>
      </form>

      <MediaPickerModal
        onChange={setMediaItems}
        onOpenChange={setMediaOpen}
        open={mediaOpen}
        value={mediaItems}
      />
    </div>
  );
}
