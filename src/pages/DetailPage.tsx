import { DownloadButton } from '@/components/DownloadButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useImageStore } from '@/hooks/useImageStore';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function DetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	// ✅ Seleciona apenas o que precisa (evita assinar o store inteiro)
	const getById = useImageStore((s) => s.getById);
	const fetchAndAddUnsplashById = useImageStore((s) => s.fetchAndAddUnsplashById);

	const initial = useMemo(() => (id ? getById(id) : undefined), [getById, id]);
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
				<div className="text-muted-foreground text-sm">Carregando...</div>
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
							alt={item.description ?? 'Imagem'}
							className="bg-muted max-h-[70vh] w-full object-contain"
						/>
						<div className="space-y-3">
							<h1 className="text-xl font-semibold">
								{item.description ?? 'Sem descrição'}
							</h1>
							<p className="text-muted-foreground text-sm">
								Autor: <span className="font-medium">{item.author}</span>
							</p>
							<p className="text-muted-foreground text-sm">
								Origem: {item.source === 'unsplash' ? 'Unsplash' : 'Local'}
							</p>
							<p className="text-muted-foreground text-sm">
								Criado em: {new Date(item.createdAt).toLocaleString()}
							</p>
							<p className="text-muted-foreground text-xs">
								Licença:{' '}
								{item.licenseUrl ? (
									<a
										className="underline"
										href={item.licenseUrl}
										target="_blank"
										rel="noreferrer noopener"
									>
										{item.licenseName ?? 'Ver licença'}
									</a>
								) : (
									'Verifique os direitos de uso para imagens locais'
								)}
							</p>
							<div className="flex gap-2">
								{item.photoLink && (
									<Button asChild variant="secondary" className="gap-2">
										<a href={item.photoLink} target="_blank" rel="noreferrer noopener">
											Ver no Unsplash <ExternalLink className="h-4 w-4" />
										</a>
									</Button>
								)}
								<DownloadButton item={item}>
									<Download className="h-4 w-4" /> Baixar
								</DownloadButton>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
