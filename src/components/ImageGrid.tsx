import { Skeleton } from '@/components/ui/skeleton';
import type { ImageItem } from '@/types/image';
import { ImageCard } from './ImageCard';

export function ImageGrid({ items, loading }: { items: ImageItem[]; loading: boolean }) {
	if (loading) {
		return (
			<div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
				{Array.from({ length: 12 }).map((_, i) => (
					<Skeleton key={i} className="h-64 w-full" />
				))}
			</div>
		);
	}
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
			{items.map((item) => (
				<ImageCard key={`${item.source}-${item.id}`} item={item} />
			))}
		</div>
	);
}
