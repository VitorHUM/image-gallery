import { getPhoto, listPhotos, PER_PAGE, searchPhotos } from '@/lib/unsplash';
import type { PhotoItem } from '@/types/photo.type';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface State {
	query: string;
	isLoading: boolean;
	isAppending: boolean;
	error?: string;
	page: number;
	hasMore: boolean;
	unsplash: PhotoItem[];
	local: PhotoItem[];
	visible: PhotoItem[];
}

// Ações
interface Actions {
	loadInitial: (q?: string) => Promise<void>;
	search: (q: string) => Promise<void>;
	loadMore: () => Promise<void>;
	addImage: (
		img: Omit<PhotoItem, 'id' | 'createdAt' | 'width' | 'height'> & {
			urlRegular: string;
			urlSmall?: string;
		},
	) => Promise<PhotoItem>;
	getById: (id: string) => PhotoItem | undefined;
	fetchAndAddUnsplashById: (id: string) => Promise<PhotoItem | undefined>;
}

// Filtra pela query atual
function filterLocal(local: PhotoItem[], q: string) {
	const term = q.trim().toLowerCase();

	if (!term) return local;

	return local.filter(
		(i) =>
			(i.description ?? '').toLowerCase().includes(term) ||
			i.author.toLowerCase().includes(term),
	);
}

// Elimina duplicadas pelo ID ao concatenar páginas
function uniqById(list: PhotoItem[]) {
	const seen = new Set<string>();
	return list.filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)));
}

export const useImageStore = create<State & Actions>()(
	persist(
		(set, get) => ({
			query: '',
			isLoading: false,
			isAppending: false,
			page: 1,
			hasMore: true,
			unsplash: [],
			local: [],
			visible: [],

			// Carga inicial ou nova busca
			loadInitial: async (q) => {
				set({ isLoading: true, error: undefined, page: 1 });
				try {
					let uns: PhotoItem[] = [];
					let hasMore = true;

					if (q && q.trim()) {
						const res = await searchPhotos(q, 1, PER_PAGE);
						uns = res.items;
						hasMore = res.totalPages > 1;
					} else {
						uns = await listPhotos(1, PER_PAGE);
						hasMore = uns.length === PER_PAGE;
					}

					const local = get().local;
					const visible = [...filterLocal(local, q ?? ''), ...uns];

					set({
						unsplash: uns,
						visible,
						isLoading: false,
						query: q ?? '',
						hasMore,
						page: 1,
					});
				} catch (e: any) {
					set({ isLoading: false, error: e?.message ?? 'Erro ao carregar fotos' });
				}
			},

			// Nova busca (página 1)
			search: async (q: string) => {
				await get().loadInitial(q);
			},

			// Carrega mais (página n+1)
			loadMore: async () => {
				if (get().isAppending || !get().hasMore) return;

				const next = get().page + 1;

				set({ isAppending: true, error: undefined });

				try {
					let more: PhotoItem[] = [];
					let hasMore = true;

					if (get().query.trim()) {
						const res = await searchPhotos(get().query, next, PER_PAGE);
						more = res.items;
						hasMore = next < res.totalPages;
					} else {
						more = await listPhotos(next, PER_PAGE);
						hasMore = more.length === PER_PAGE;
					}

					const unsplash = uniqById([...get().unsplash, ...more]);
					const visible = [...filterLocal(get().local, get().query), ...unsplash];

					set({ unsplash, visible, page: next, hasMore, isAppending: false });
				} catch (e: any) {
					set({ isAppending: false, error: e?.message ?? 'Erro ao carregar mais' });
				}
			},

			// Adiciona foto
			addImage: async ({ urlRegular, urlSmall, author, description, photoLink }) => {
				const id = `local-${crypto?.randomUUID?.() ?? Date.now()}`;

				const dims = await new Promise<{ width: number; height: number }>((resolve) => {
					const img = new Image();

					img.onload = () =>
						resolve({
							width: img.naturalWidth || 1920,
							height: img.naturalHeight || 1080,
						});

					img.onerror = () => resolve({ width: 1920, height: 1080 });

					img.src = urlRegular;
				});

				const item: PhotoItem = {
					id,
					urlRegular,
					urlSmall: urlSmall ?? urlRegular,
					width: dims.width,
					height: dims.height,
					description: description ?? 'Foto adicionada pelo usuário',
					author,
					photoLink,
					createdAt: new Date().toISOString(),
				};

				const local = [item, ...get().local];
				const visible = [...filterLocal(local, get().query), ...get().unsplash];

				set({ local, visible });

				return item;
			},

			// Busca foto por ID
			getById: (id: string) => {
				const s = get();
				return s.local.find((i) => i.id === id) || s.unsplash.find((i) => i.id === id);
			},

			// Busca foto no Unsplash por ID e adiciona à store
			fetchAndAddUnsplashById: async (id: string) => {
				try {
					const found = get().unsplash.find((i) => i.id === id);

					if (found) return found;

					const img = await getPhoto(id);
					const unsplash = uniqById([img, ...get().unsplash]);
					const visible = [...filterLocal(get().local, get().query), ...unsplash];

					set({ unsplash, visible });

					return img;
				} catch (e) {
					console.error(e);
					return undefined;
				}
			},
		}),
		{ name: 'image-gallery-store' },
	),
);
