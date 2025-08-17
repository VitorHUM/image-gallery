import { Button } from '@/components/ui/button';
import { getDownloadUrl } from '@/lib/unsplash';
import type { ImageItem } from '@/types/image';
import type { PropsWithChildren } from 'react';

function triggerDownload(filename: string, blob: Blob) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}

function slugify(s: string) {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9-_]+/g, '_')
		.replace(/^_+|_+$/g, '');
}

export function DownloadButton({
	item,
	children,
}: PropsWithChildren<{ item: ImageItem }>) {
	return (
		<Button
			variant="default"
			onClick={async () => {
				try {
					if (item.source === 'unsplash') {
						const trackedUrl = await getDownloadUrl(item.id); // conta o download
						// baixa o blob dessa URL (em vez de abrir em nova aba)
						const resp = await fetch(trackedUrl, { mode: 'cors' });
						const blob = await resp.blob();
						const ct = resp.headers.get('Content-Type') || 'image/jpeg';
						const ext = ct.includes('/') ? ct.split('/')[1].split(';')[0] : 'jpg';
						const name = (slugify(item.description || item.id) || item.id) + '.' + ext;
						triggerDownload(name, blob);
						return;
					}
					// Local (URL ou blob)
					const resp = await fetch(item.urlRegular);
					const blob = await resp.blob();
					const ct = resp.headers.get('Content-Type') || 'image/png';
					const ext = ct.includes('/') ? ct.split('/')[1].split(';')[0] : 'png';
					const name = (slugify(item.description || item.id) || item.id) + '.' + ext;
					triggerDownload(name, blob);
				} catch (e) {
					// fallback: se CORS bloquear, pelo menos abre
					console.error(e);
					if (item.source === 'unsplash') {
						const trackedUrl = await getDownloadUrl(item.id);
						window.open(trackedUrl, '_blank', 'noopener,noreferrer');
					} else {
						window.open(item.urlRegular, '_blank', 'noopener,noreferrer');
					}
				}
			}}
			title={
				item.source === 'unsplash'
					? 'Baixar (contabiliza download no Unsplash)'
					: 'Baixar imagem local'
			}
		>
			{children}
		</Button>
	);
}
