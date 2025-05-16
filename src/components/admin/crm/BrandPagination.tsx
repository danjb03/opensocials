
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface BrandPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const BrandPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: BrandPaginationProps) => {
  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // If we're showing less than 3 pages in the middle, adjust to show more
    if (endPage - startPage < 2) {
      if (currentPage < totalPages / 2) {
        endPage = Math.min(totalPages - 1, startPage + 2);
      } else {
        startPage = Math.max(2, endPage - 2);
      }
    }
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('ellipsis-start');
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('ellipsis-end');
    }
    
    // Always show last page if more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        
        {pageNumbers.map((page, idx) => (
          typeof page === 'number' ? (
            <PaginationItem key={idx}>
              <PaginationLink 
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
