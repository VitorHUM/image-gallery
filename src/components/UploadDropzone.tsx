import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useImageStore } from '@/hooks/useImageStore';
import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

export function UploadDropzone() {
	const addLocalImage = useImageStore((s) => s.addLocalImage);
	const inputRef = useRef<HTMLInputElement>(null);
	const [over, setOver] = useState(false);

	async function handleFiles(fs: FileList | null) {
		if (!fs || fs.length === 0) return;
		for (const f of Array.from(fs)) {
			if (!f.type.startsWith('image/')) continue;
			const url = URL.createObjectURL(f);
			await addLocalImage({
				urlRegular: url,
				urlSmall: url,
				description: f.name,
				author: 'Você',
			});
		}
	}

	return (
		<Card
			className={`border-dashed p-4 ${over ? 'border-primary' : 'border-muted-foreground/30'} text-sm`}
			onDragOver={(e) => {
				e.preventDefault();
				setOver(true);
			}}
			onDragLeave={() => setOver(false)}
			onDrop={async (e) => {
				e.preventDefault();
				setOver(false);
				await handleFiles(e.dataTransfer.files);
			}}
			role="region"
			aria-label="Área para soltar imagens para upload"
		>
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="text-muted-foreground">Arraste e solte imagens aqui, ou</div>
				<div className="flex gap-2">
					<input
						ref={inputRef}
						type="file"
						accept="image/*"
						multiple
						className="hidden"
						onChange={async (e) => {
							await handleFiles(e.target.files);
						}}
					/>
					<Button
						type="button"
						variant="outline"
						className="gap-2"
						onClick={() => inputRef.current?.click()}
					>
						<Upload className="h-4 w-4" /> Escolher arquivos
					</Button>
				</div>
			</div>
		</Card>
	);
}
