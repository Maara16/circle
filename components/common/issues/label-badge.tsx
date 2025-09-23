import { Badge } from '@/components/ui/badge';
import { Label } from '@/types';

export function LabelBadge({ labels }: { labels: Label[] }) {
   return (
      <>
         {labels.map((l) => (
            <Badge
               key={l._id}
               variant="outline"
               className="gap-1.5 rounded-full text-muted-foreground bg-background"
            >
               <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: l.color }}
                  aria-hidden="true"
               ></span>
               {l.name}
            </Badge>
         ))}
      </>
   );
}
