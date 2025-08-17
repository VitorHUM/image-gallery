import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useImageStore } from '@/hooks/useImageStore';
import { Plus } from 'lucide-react';
import { useRef, useState } from 'react';

export function AddImageDialog() {
	const addLocalImage = useImageStore((s) => s.addLocalImage);
	const [open, setOpen] = useState(false);
	const [url, setUrl] = useState('');
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [saving, setSaving] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="secondary" className="gap-2">
					<Plus className="h-4 w-4" /> Adicionar
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Adicionar imagem</DialogTitle>
				</DialogHeader>
				<div className="space-y-3">
					<Input
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						placeholder="URL da imagem (https://...)"
					/>
					<Input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Descrição / título (opcional)"
					/>
					<Input
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
						placeholder="Autor (opcional)"
					/>
				</div>
				<DialogFooter>
					<Button
						onClick={async () => {
							if (!url) return;
							setSaving(true);
							try {
								await addLocalImage({
									urlRegular: url,
									urlSmall: url,
									description: title || undefined,
									author: author || 'Você',
								});
								// Mantém o filtro atual ao adicionar
								setOpen(false);
								setUrl('');
								setTitle('');
								setAuthor('');
							} finally {
								setSaving(false);
							}
						}}
						disabled={!url || saving}
					>
						Salvar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
