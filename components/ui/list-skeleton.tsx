import { Skeleton } from '@/components/ui/skeleton';

interface ListSkeletonProps {
  rows?: number;
  columns: {
    width: string;
    className?: string;
  }[];
}

export default function ListSkeleton({ rows = 5, columns }: ListSkeletonProps) {
  return (
    <div className="w-full space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-2">
          {columns.map((col, j) => (
            <Skeleton
              key={j}
              className={`h-8 ${col.width} ${col.className || ''}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}