import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useImageStore } from '@/hooks/useImageStore';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Label } from './ui/label';

export function SearchBar() {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const initial = params.get('q') ?? '';
	const [value, setValue] = useState(initial);
	const search = useImageStore((s) => s.search);

	useEffect(() => {
		setValue(initial);
	}, [initial]);

	async function handleSearch(e: React.FormEvent) {
		e.preventDefault();

		await search(value);

		navigate(value ? `/?q=${encodeURIComponent(value)}` : '/');
	}

	return (
		<form
			onSubmit={handleSearch}
			role="search"
			aria-label="Buscar Fotos"
			className="flex items-center gap-2"
		>
			<div className="relative">
				<Label htmlFor="image-search" className="sr-only">
					Buscar fotos
				</Label>

				<Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 opacity-60" />

				<Input
					id="image-search"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					placeholder="Buscar fotos"
					className="px-8"
					aria-label="Buscar Fotos"
				/>

				{value && (
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="hover:text-primary-gray absolute right-0 top-1/2 -translate-y-1/2 hover:bg-transparent"
						aria-label="Limpar busca"
						onClick={() => setValue('')}
					>
						<X className="size-4" />
					</Button>
				)}
			</div>

			<Button
				type="submit"
				className="bg-primary-green-dark hover:bg-primary-green-dark/80"
			>
				Buscar
			</Button>
		</form>
	);
}
