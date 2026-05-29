"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/primitives";

const CATALOG_PAGE_SIZE = 60;

type CatalogLoadMoreProps = {
  total: number;
  shown: number;
};

export function CatalogLoadMore({ total, shown }: CatalogLoadMoreProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (shown >= total) return null;

  const next = new URLSearchParams(searchParams.toString());
  const currentOffset = Number.parseInt(next.get("offset") ?? "0", 10) || 0;
  next.set("offset", String(currentOffset + CATALOG_PAGE_SIZE));
  const href = `${pathname}?${next.toString()}`;

  return (
    <div className="mt-6 flex justify-center">
      <Link href={href} className="block w-full max-w-xs">
        <Button variant="secondary" size="large" className="w-full">
          Load more ({shown} of {total})
        </Button>
      </Link>
    </div>
  );
}

export { CATALOG_PAGE_SIZE };
