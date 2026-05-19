"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import FiltersSidebar from "@/components/website/FiltersSidebar";
import ProductBox from "@/components/website/ProductBox";
import Sorting from "@/components/website/Sorting";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";
import useWindowSize from "@/hooks/useWindowSize";

export default function ShopPage() {
  const { width } = useWindowSize();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = useState("default");
  const [openFilterSheet, setOpenFilterSheet] = useState(false);

  // Lấy filter params từ URL
  const category = searchParams.get("category") || "";
  const color = searchParams.get("color") || "";
  const size = searchParams.get("size") || "";
  const minPrice = searchParams.get("min") || "";
  const maxPrice = searchParams.get("max") || "";

  const fetchProducts = async ({ pageParam = 1 }) => {
    const { data } = await axios.get("/api/shop", {
      params: {
        category,
        color,
        limit: 12,
        maxPrice,
        minPrice,
        page: pageParam,
        size,
        sort: sorting,
      },
    });

    return data;
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
      queryFn: fetchProducts,
      queryKey: [
        "shop-products",
        sorting,
        category,
        color,
        size,
        minPrice,
        maxPrice,
      ],
    });

  const allProducts = data?.pages?.flatMap((page) => page.products) || [];
  const products = Array.from(
    new Map(allProducts.map((p) => [p._id, p])).values(),
  );

  return (
    <div className="min-h-screen bg-white">
      <WebsiteBreadcrumb
        links={[{ href: "/", label: "Trang Chủ" }, { label: "Cửa Hàng" }]}
      />

      <section className="px-4 py-8 lg:px-32">
        {/* Mobile Filter Dialog */}
        {width > 0 && width < 1024 && (
          <Suspense>
            <Dialog.Root
              onOpenChange={setOpenFilterSheet}
              open={openFilterSheet}
            >
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />

                <Dialog.Content className="fixed left-0 top-0 z-50 h-screen w-[320px] overflow-y-auto bg-white p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Bộ Lọc</h2>

                    <Dialog.Close asChild>
                      <button type="button">
                        <X size={20} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <FiltersSidebar />
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </Suspense>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Desktop Sidebar */}
          {width >= 1024 && (
            <div className="lg:col-span-3">
              <Suspense>
                <FiltersSidebar />
              </Suspense>
            </div>
          )}

          {/* Products */}
          <div className={width >= 1024 ? "lg:col-span-9" : "col-span-1"}>
            <Suspense>
              <Sorting
                setOpenFilterSheet={setOpenFilterSheet}
                setSorting={setSorting}
                sorting={sorting}
              />
            </Suspense>

            {/* Loading skeleton */}
            {isLoading && (
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    className="h-80 animate-pulse rounded-2xl bg-gray-100"
                    key={i.toString()}
                  />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!isLoading && products.length === 0 && (
              <div className="flex h-60 items-center justify-center">
                <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
              </div>
            )}

            {/* Product grid */}
            {!isLoading && products.length > 0 && (
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductBox key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Load More */}
            {hasNextPage && (
              <div className="mt-10 flex justify-center">
                <button
                  className="rounded-md bg-black px-6 py-3 text-white transition-all hover:opacity-90 disabled:opacity-50"
                  disabled={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                  type="button"
                >
                  {isFetchingNextPage ? "Đang tải..." : "Tải Thêm"}
                </button>
              </div>
            )}

            {!hasNextPage && products.length > 0 && (
              <p className="mt-10 text-center text-sm text-gray-400">
                Đã hiển thị tất cả sản phẩm
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
