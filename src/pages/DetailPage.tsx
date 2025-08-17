import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useImageStore } from '@/hooks/useImageStore';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function DetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const getById = useImageStore((s) => s.getById);
	const fetchAndAddUnsplashById = useImageStore((s) => s.fetchAndAddUnsplashById);

	const initial = id ? getById(id) : undefined;
	const [item, setItem] = useState(initial);

	useEffect(() => {
		let mounted = true;
		(async () => {
			if (!item && id) {
				const fetched = await fetchAndAddUnsplashById(id);

				if (mounted) setItem(fetched);
			}
		})();
		return () => {
			mounted = false;
		};
	}, [fetchAndAddUnsplashById, id, item]);

	if (!id) return null;

	if (!item) {
		return (
			<div className="space-y-4">
				<Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
					<ArrowLeft className="h-4 w-4" /> Voltar
				</Button>

				<div className="text-primary-gray text-sm">Carregando...</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
				<ArrowLeft className="h-4 w-4" /> Voltar
			</Button>

			<Card>
				<CardContent className="p-4">
					<div className="grid gap-4 md:grid-cols-2">
						<img
							src={item.urlRegular}
							alt={item.description ?? 'Foto'}
							className="bg-muted max-h-[70vh] w-full object-contain"
						/>

						<div className="space-y-3">
							<h1 className="text-xl font-semibold">
								{item.description ?? 'Sem título/descrição'}
							</h1>

							<p className="text-primary-gray text-sm">
								Autor: <b>{item.author}</b>
							</p>

							<p className="text-primary-gray text-sm">
								Criado em:{' '}
								{new Date(item.createdAt).toLocaleDateString('pt-BR', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
								})}{' '}
								às{' '}
								{new Date(item.createdAt).toLocaleTimeString('pt-BR', {
									hour: '2-digit',
									minute: '2-digit',
								})}
							</p>

							<div className="flex gap-2">
								{item.photoLink && (
									<Button asChild variant="secondary" className="gap-2">
										<a href={item.photoLink} target="_blank" rel="noreferrer noopener">
											Ver no Unsplash <ExternalLink className="h-4 w-4" />
										</a>
									</Button>
								)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
