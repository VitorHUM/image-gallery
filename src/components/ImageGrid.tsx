import type { PhotoItem } from '@/types/photo.type';
import { ImageCard } from './ImageCard';

export function ImageGrid({ items }: { items: PhotoItem[] }) {
	return (
		<div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
			{items.map((item) => (
				<ImageCard key={`${item.id}`} item={item} />
			))}
		</div>
	);
}
