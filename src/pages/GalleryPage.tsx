import { ImageGrid } from '@/components/ImageGrid';
import { Button } from '@/components/ui/button';
import { useImageStore } from '@/hooks/useImageStore';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function GalleryPage() {
	const [params] = useSearchParams();
	const q = params.get('q') ?? '';

	const isAppending = useImageStore((s) => s.isAppending);
	const hasMore = useImageStore((s) => s.hasMore);
	const loadMore = useImageStore((s) => s.loadMore);
	const visible = useImageStore((s) => s.visible);
	const error = useImageStore((s) => s.error);
	const loadInitial = useImageStore((s) => s.loadInitial);

	useEffect(() => {
		loadInitial(q);
	}, [loadInitial, q]);

	return (
		<div className="space-y-4">
			{error && <div className="text-destructive text-sm">{error}</div>}

			<ImageGrid items={visible} />

			{hasMore && (
				<div className="flex justify-center">
					<Button onClick={loadMore} disabled={isAppending} variant="secondary">
						{isAppending ? 'Carregando...' : 'Carregar mais'}
					</Button>
				</div>
			)}
		</div>
	);
}
