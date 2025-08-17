import type { PhotoItem, UnsplashPhoto } from '@/types/photo.type';

const BASE = 'https://api.unsplash.com';
const KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string;

export const PER_PAGE = 15;

if (!KEY) {
	console.warn('VITE_UNSPLASH_ACCESS_KEY ausente. Defina em .env.local');
}

// Mapear o objeto UnsplashPhoto para PhotoItem
function mapPhoto(p: UnsplashPhoto): PhotoItem {
	return {
		id: p.id,
		urlSmall: p.urls.small,
		urlRegular: p.urls.regular,
		width: p.width,
		height: p.height,
		description: p.description ?? p.alt_description,
		author: p.user?.name ?? 'Autor desconhecido',
		photoLink: p.links?.html,
		createdAt: p.created_at,
	};
}

// Função genérica para fazer requisições à API do Unsplash
async function request<T>(path: string): Promise<T> {
	const url = `${BASE}${path}${path.includes('?') ? '&' : '?'}client_id=${KEY}`;
	const res = await fetch(url, { headers: { 'Accept-Version': 'v1' } });
	if (!res.ok) throw new Error(`Unsplash error ${res.status}`);
	return res.json() as Promise<T>;
}

// Funções para listar fotos
export async function listPhotos(page = 1, perPage = PER_PAGE): Promise<PhotoItem[]> {
	const data = await request<UnsplashPhoto[]>(
		`/photos?page=${page}&per_page=${perPage}&order_by=latest`,
	);
	return data.map(mapPhoto);
}

// Função para buscar fotos por query
export async function searchPhotos(
	query: string,
	page = 1,
	perPage = PER_PAGE,
): Promise<{ items: PhotoItem[]; totalPages: number }> {
	const data = await request<{
		total: number;
		total_pages: number;
		results: UnsplashPhoto[];
	}>(
		`/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&order_by=relevant`,
	);
	return { items: data.results.map(mapPhoto), totalPages: data.total_pages };
}

// Função para obter uma foto pelo ID
export async function getPhoto(id: string): Promise<PhotoItem> {
	const data = await request<UnsplashPhoto>(`/photos/${id}`);
	return mapPhoto(data);
}
