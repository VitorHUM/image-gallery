import { AddImageDialog } from '@/components/AddImageDialog';
import { SearchBar } from '@/components/SearchBar';
import { Separator } from '@/components/ui/separator';
import DetailPage from '@/pages/DetailPage';
import GalleryPage from '@/pages/GalleryPage';
import { Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';

function Layout() {
	return (
		<div className="mx-auto min-h-dvh max-w-7xl p-4">
			<header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<Link to="/" className="text-2xl font-bold">
					Galeria
				</Link>

				<div className="flex gap-2">
					<SearchBar />

					<AddImageDialog />
				</div>
			</header>

			<Separator className="my-4" />
			<main>
				<Outlet />
			</main>
		</div>
	);
}

export default function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<GalleryPage />} />

				<Route path="/image/:id" element={<DetailPage />} />

				<Route path="*" element={<Navigate to="/" replace />} />
			</Route>
		</Routes>
	);
}
