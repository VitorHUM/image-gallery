import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useImageStore } from '@/hooks/useImageStore';
import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function SearchBar() {
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const initial = params.get('q') ?? '';
	const [value, setValue] = useState(initial);
	const search = useImageStore((s) => s.search);

	// Debounce
	const debounced = useMemo(() => {
		let t: number | undefined;
		return (q: string) => {
			window.clearTimeout(t);
			// 350ms de debounce para UX suave
			t = window.setTimeout(async () => {
				await search(q);
				navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
			}, 350);
		};
	}, [navigate, search]);

	useEffect(() => {
		setValue(initial);
	}, [initial]);

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault();
				await search(value);
				navigate(value ? `/?q=${encodeURIComponent(value)}` : '/');
			}}
			className="flex w-full gap-2"
		>
			<div className="relative flex-1">
				<Search className="text-muted-foreground absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2" />
				<Input
					value={value}
					onChange={(e) => {
						setValue(e.target.value);
						debounced(e.target.value);
					}}
					placeholder="Buscar imagens..."
					className="pl-8"
					aria-label="Buscar imagens"
				/>
			</div>
			<Button type="submit">Buscar</Button>
		</form>
	);
}
