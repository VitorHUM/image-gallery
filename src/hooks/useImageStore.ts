import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ImageItem } from '@/types/image'
import { getPhoto, listPhotos, searchPhotos, PER_PAGE } from '@/lib/unsplash'

interface State {
  query: string
  isLoading: boolean
  isAppending: boolean
  error?: string
  page: number
  hasMore: boolean
  unsplash: ImageItem[]
  local: ImageItem[]
  visible: ImageItem[]
}

interface Actions {
  loadInitial: (q?: string) => Promise<void>
  search: (q: string) => Promise<void>
  loadMore: () => Promise<void>
  addLocalImage: (img: Omit<ImageItem, 'id' | 'source' | 'createdAt' | 'width' | 'height'> & { urlRegular: string; urlSmall?: string }) => Promise<ImageItem>
  getById: (id: string) => ImageItem | undefined
  fetchAndAddUnsplashById: (id: string) => Promise<ImageItem | undefined>
}

function filterLocal(local: ImageItem[], q: string) {
  const term = q.trim().toLowerCase()
  if (!term) return local
  return local.filter((i) => (i.description ?? '').toLowerCase().includes(term) || i.author.toLowerCase().includes(term))
}

// 🔑 elimina duplicadas pelo id ao concatenar páginas
function uniqById(list: ImageItem[]) {
  const seen = new Set<string>()
  return list.filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)))
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

      loadInitial: async (q) => {
        set({ isLoading: true, error: undefined, page: 1 })
        try {
          let uns: ImageItem[] = []
          let hasMore = true

          if (q && q.trim()) {
            const res = await searchPhotos(q, 1, PER_PAGE)
            uns = res.items
            hasMore = res.totalPages > 1
          } else {
            uns = await listPhotos(1, PER_PAGE)
            // heurística simples: se veio lote cheio, provavelmente há mais
            hasMore = uns.length === PER_PAGE
          }

          const local = get().local
          const visible = [...filterLocal(local, q ?? ''), ...uns]
          set({ unsplash: uns, visible, isLoading: false, query: q ?? '', hasMore, page: 1 })
        } catch (e: any) {
          set({ isLoading: false, error: e?.message ?? 'Erro ao carregar imagens' })
        }
      },

      search: async (q: string) => {
        await get().loadInitial(q) // reseta a paginação
      },

      loadMore: async () => {
        if (get().isAppending || !get().hasMore) return
        const next = get().page + 1
        set({ isAppending: true, error: undefined })
        try {
          let more: ImageItem[] = []
          let hasMore = true

          if (get().query.trim()) {
            const res = await searchPhotos(get().query, next, PER_PAGE)
            more = res.items
            hasMore = next < res.totalPages
          } else {
            more = await listPhotos(next, PER_PAGE)
            hasMore = more.length === PER_PAGE
          }

          // 🔒 concatena e remove duplicadas por id (evita “duas últimas se repetirem”)
          const unsplash = uniqById([...get().unsplash, ...more])
          const visible = [...filterLocal(get().local, get().query), ...unsplash]

          set({ unsplash, visible, page: next, hasMore, isAppending: false })
        } catch (e: any) {
          set({ isAppending: false, error: e?.message ?? 'Erro ao carregar mais' })
        }
      },

      addLocalImage: async ({ urlRegular, urlSmall, author, description, authorLink, photoLink }) => {
        const id = `local-${crypto?.randomUUID?.() ?? Date.now()}`
        const dims = await new Promise<{ width: number; height: number }>((resolve) => {
          const img = new Image()
          img.onload = () => resolve({ width: img.naturalWidth || 1920, height: img.naturalHeight || 1080 })
          img.onerror = () => resolve({ width: 1920, height: 1080 })
          img.src = urlRegular
        })
        const item: ImageItem = {
          id,
          urlRegular,
          urlSmall: urlSmall ?? urlRegular,
          width: dims.width,
          height: dims.height,
          description: description ?? 'Imagem adicionada pelo usuário',
          author,
          authorLink,
          photoLink,
          createdAt: new Date().toISOString(),
          source: 'local',
        }
        const local = [item, ...get().local]
        const visible = [...filterLocal(local, get().query), ...get().unsplash]
        set({ local, visible })
        return item
      },

      getById: (id: string) => {
        const s = get()
        return s.local.find((i) => i.id === id) || s.unsplash.find((i) => i.id === id)
      },

      fetchAndAddUnsplashById: async (id: string) => {
        try {
          const found = get().unsplash.find((i) => i.id === id)
          if (found) return found
          const img = await getPhoto(id)
          const unsplash = uniqById([img, ...get().unsplash])
          const visible = [...filterLocal(get().local, get().query), ...unsplash]
          set({ unsplash, visible })
          return img
        } catch (e) {
          console.error(e)
          return undefined
        }
      },
    }),
    { name: 'image-gallery-store' }
  )
)
