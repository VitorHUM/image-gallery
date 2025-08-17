import { Card, CardContent } from '@/components/ui/card';
import type { ImageItem } from '@/types/image';
import { Link } from 'react-router-dom';

export function ImageCard({ item }: { item: ImageItem }) {
	return (
		<Link to={`/image/${item.id}`} aria-label={`Ver detalhes da imagem ${item.id}`}>
			<Card className="overflow-hidden transition-shadow hover:shadow-md">
				<CardContent className="p-0">
					<img
						src={item.urlSmall}
						alt={item.description ?? 'Imagem'}
						loading="lazy"
						className="h-48 w-full object-cover"
					/>
					<div className="p-3 text-sm">
						<p className="text-muted-foreground line-clamp-2">
							{item.description ?? 'Sem descrição'}
						</p>
						<p className="mt-1 text-xs">
							por <span className="font-medium">{item.author}</span>
							{item.source === 'unsplash' && ' · Unsplash'}
						</p>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
