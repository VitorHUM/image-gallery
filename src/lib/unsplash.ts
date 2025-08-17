import type { ImageItem } from '@/types/image';

const BASE = 'https://api.unsplash.com';
const KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string;

export const PER_PAGE = 15; // mantenha fixo para não “desalinhar” páginas

if (!KEY) {
	console.warn('VITE_UNSPLASH_ACCESS_KEY ausente. Defina em .env.local');
}

type UnsplashUser = { name: string; links: { html: string } };
type UnsplashPhoto = {
	id: string;
	urls: { small: string; regular: string };
	width: number;
	height: number;
	description: string | null;
	alt_description: string | null;
	user: UnsplashUser;
	created_at: string;
	links: { html: string; download?: string; download_location?: string };
};

function mapPhoto(p: UnsplashPhoto): ImageItem {
	return {
		id: p.id,
		urlSmall: p.urls.small,
		urlRegular: p.urls.regular,
		width: p.width,
		height: p.height,
		description: p.description ?? p.alt_description,
		author: p.user?.name ?? 'Autor desconhecido',
		authorLink: p.user?.links?.html,
		photoLink: p.links?.html,
		createdAt: p.created_at,
		source: 'unsplash',
	};
}

async function request<T>(path: string): Promise<T> {
	const url = `${BASE}${path}${path.includes('?') ? '&' : '?'}client_id=${KEY}`;
	const res = await fetch(url, { headers: { 'Accept-Version': 'v1' } });
	if (!res.ok) throw new Error(`Unsplash error ${res.status}`);
	return res.json() as Promise<T>;
}

export async function listPhotos(page = 1, perPage = PER_PAGE): Promise<ImageItem[]> {
	// order_by para estabilidade
	const data = await request<UnsplashPhoto[]>(
		`/photos?page=${page}&per_page=${perPage}&order_by=latest`,
	);
	return data.map(mapPhoto);
}

export async function searchPhotos(
	query: string,
	page = 1,
	perPage = PER_PAGE,
): Promise<{ items: ImageItem[]; totalPages: number }> {
	const data = await request<{
		total: number;
		total_pages: number;
		results: UnsplashPhoto[];
	}>(
		`/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&order_by=relevant`,
	);
	return { items: data.results.map(mapPhoto), totalPages: data.total_pages };
}

export async function getPhoto(id: string): Promise<ImageItem> {
	const data = await request<UnsplashPhoto>(`/photos/${id}`);
	return mapPhoto(data);
}

// Requisito da API: contabiliza o download e retorna a URL final do arquivo
export async function getDownloadUrl(id: string): Promise<string> {
	const data = await request<{ url: string }>(`/photos/${id}/download`);
	return data.url;
}
