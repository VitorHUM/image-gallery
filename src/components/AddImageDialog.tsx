import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useImageStore } from '@/hooks/useImageStore';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export function AddImageDialog() {
	const [open, setOpen] = useState(false);
	const [url, setUrl] = useState('');
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [saving, setSaving] = useState(false);

	const addImage = useImageStore((s) => s.addImage);

	// Função para resetar todos os campos
	function resetAll() {
		setUrl('');
		setTitle('');
		setAuthor('');
	}

	// Função para salvar a foto por URL
	async function handleSave(event?: React.FormEvent) {
		event?.preventDefault();

		if (!url || !title) return;

		setSaving(true);

		try {
			await addImage({
				urlRegular: url,
				urlSmall: url,
				description: title,
				author: author || 'Você',
			});

			setOpen(false);
			resetAll();
		} finally {
			setSaving(false);
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				setOpen(o);
				if (!o) resetAll();
			}}
		>
			<DialogTrigger asChild>
				<Button className="bg-primary-purple hover:bg-primary-purple/80 gap-2">
					<Plus className="h-4 w-4" /> Adicionar Foto
				</Button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Adicionar Foto</DialogTitle>

					<DialogDescription>Insira as informações da foto</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSave} className="mt-4 space-y-3">
					<div className="flex items-center gap-2">
						<Input
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="URL da foto"
							inputMode="url"
							aria-invalid={!url ? true : undefined}
						/>
					</div>

					<Input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Título / Descrição"
						required
						aria-invalid={!title ? true : undefined}
					/>

					<Input
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
						placeholder="Autor"
					/>

					<DialogFooter className="mt-2">
						<Button
							type="submit"
							disabled={!url || !title || saving}
							className="bg-primary-green-dark hover:bg-primary-green-dark/80"
						>
							{saving ? 'Salvando...' : 'Salvar'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
