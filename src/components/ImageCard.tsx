import { Card, CardContent } from '@/components/ui/card';
import type { PhotoItem } from '@/types/photo.type';
import { Link } from 'react-router-dom';

export function ImageCard({ item }: { item: PhotoItem }) {
	return (
		<Link to={`/image/${item.id}`} aria-label={`Ver detalhes da foto ${item.id}`}>
			<Card className="overflow-hidden transition-shadow hover:shadow-md">
				<CardContent className="p-0">
					<img
						src={item.urlSmall}
						alt={item.description ?? 'Foto'}
						loading="lazy"
						className="h-48 w-full object-cover"
					/>

					<div className="p-3 text-sm">
						<p className="text-primary-gray line-clamp-2">
							{item.description ?? 'Sem título/descrição'}
						</p>

						<p className="text-primary-dark mt-2 text-xs">
							Autor: <b>{item.author}</b>
						</p>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
