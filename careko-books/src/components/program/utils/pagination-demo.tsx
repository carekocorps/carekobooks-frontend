'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationDemoProps {
  totalPages: number;
  page: number;
  setPage: (page: number) => void;
}

export function PaginationDemo({ totalPages, page, setPage }: PaginationDemoProps) {
  if (totalPages <= 1) return null;

  const handleSetPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  
  const range = () => {
    const delta = 2;
    const pages: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleSetPage(page - 1);
            }}
          />
        </PaginationItem>

        {range().map((p, i) => (
          <PaginationItem key={i}>
            {p === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault();
                  handleSetPage(Number(p));
                }}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleSetPage(page + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
