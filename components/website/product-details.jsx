"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import ProductReview from "./product-review";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const getImageUrl = (item) => {
  if (item.secureUrl) return item.secureUrl;
  if (item.path)
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${item.path}`;
  return "https://placehold.co/600x800/png";
};

const ProductDetails = ({ data }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.user);

  const { product, variant, colors, sizes, reviewCount } = data;

  const [activeThumb, setActiveThumb] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loadingVariant, setLoadingVariant] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const images = useMemo(() => {
    if (variant?.media?.length > 0) {
      return variant.media;
    }
    return product.media;
  }, [variant, product]);

  const updateVariant = (key, value) => {
    setLoadingVariant(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);

    setTimeout(() => {
      setLoadingVariant(false);
    }, 500);
  };

  const discount =
    Math.round(((product.mrp - product.sellingPrice) / product.mrp) * 100) || 0;

  const cartProduct = {
    color: variant?.color,
    image: images?.[0]?.secureUrl || images?.[0]?.path,
    name: product.name,
    price: product.sellingPrice,
    productId: product._id,
    quantity,
    size: variant?.size,
    slug: product.slug,
    variantId: variant?._id,
  };

  const handleAddToCart = () => {
    dispatch(addToCart(cartProduct));
    setAddedToCart(true);
  };

  return (
    <>
      <section className="bg-white py-10 lg:px-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/">Trang Chủ</Link>
            <span>/</span>
            <Link href="/shop">Sản Phẩm</Link>
            <span>/</span>
            <span className="text-black font-medium">{product.name}</span>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Gallery */}
            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3">
                {images?.map((item, index) => (
                  <button
                    className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                      activeThumb === index ? "border-black" : "border-gray-200"
                    }`}
                    key={item.path || item.secureUrl}
                    onClick={() => setActiveThumb(index)}
                    type="button"
                  >
                    <Image
                      alt="thumb"
                      className="h-20 w-20 object-cover"
                      height={80}
                      src={getImageUrl(item)}
                      width={80}
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1">
                <div className="relative overflow-hidden rounded-3xl border bg-gray-100">
                  <Image
                    alt={product.name}
                    className="h-[550px] w-full object-cover transition-all duration-500 hover:scale-105"
                    height={800}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={getImageUrl(images?.[activeThumb] || {})}
                    width={800}
                  />
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div>
              {/* Title */}
              <h1 className="mb-4 text-3xl font-bold lg:text-4xl">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <FaStar key={item} size={16} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({reviewCount} Đánh Giá)
                </span>
              </div>

              {/* Pricing */}
              <div className="mb-6 flex items-center gap-4">
                <h2 className="text-4xl font-bold text-primary">
                  {Number(product.sellingPrice).toLocaleString("vi-VN", {
                    currency: "VND",
                    style: "currency",
                  })}
                </h2>
                <span className="text-xl text-gray-400 line-through">
                  {Number(product.mrp).toLocaleString("vi-VN", {
                    currency: "VND",
                    style: "currency",
                  })}
                </span>
                <span className="rounded-full bg-red-500 px-3 py-1 text-sm text-white">
                  -{discount}%
                </span>
              </div>

              {/* Description */}
              <p className="mb-8 leading-7 text-gray-600 line-clamp-3">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="mb-8">
                <h4 className="mb-3 font-semibold">Chọn Màu</h4>
                <div className="flex flex-wrap gap-3">
                  {colors?.map((color) => (
                    <button
                      className={`rounded-full border px-5 py-2 capitalize transition-all duration-300 ${
                        variant?.color === color
                          ? "border-black bg-black text-white"
                          : "border-gray-300"
                      }`}
                      key={color}
                      onClick={() => updateVariant("color", color)}
                      type="button"
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-8">
                <h4 className="mb-3 font-semibold">Chọn Size</h4>
                <div className="flex flex-wrap gap-3">
                  {sizes?.map((size) => (
                    <button
                      className={`h-12 w-12 rounded-full border transition-all duration-300 ${
                        variant?.size === size
                          ? "border-black bg-black text-white"
                          : "border-gray-300"
                      }`}
                      key={size}
                      onClick={() => updateVariant("size", size)}
                      type="button"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Loading */}
              {loadingVariant && (
                <div className="mb-5">
                  <p className="text-sm text-primary">Đang cập nhật...</p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8 flex items-center gap-5">
                <div className="flex items-center overflow-hidden rounded-full border">
                  <button
                    className="flex h-12 w-12 items-center justify-center"
                    onClick={() =>
                      setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                    type="button"
                  >
                    <FiMinus />
                  </button>
                  <span className="w-12 text-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    className="flex h-12 w-12 items-center justify-center"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    type="button"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>

              {/* Add To Cart */}
              {!addedToCart ? (
                <button
                  className="rounded-full bg-black px-10 py-4 text-white transition-all duration-300 hover:opacity-90"
                  onClick={handleAddToCart}
                  type="button"
                >
                  Thêm Vào Giỏ
                </button>
              ) : (
                <Link
                  className="inline-block rounded-full bg-primary px-10 py-4 text-white"
                  href="/cart"
                >
                  Xem Giỏ Hàng
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <ProductReview auth={auth} productId={product._id} slug={product.slug} />
    </>
  );
};

export default ProductDetails;
