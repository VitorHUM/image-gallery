export type ImageItem = {
	id: string;
	urlSmall: string;
	urlRegular: string;
	width: number;
	height: number;
	description?: string | null;
	author: string;
	authorLink?: string;
	photoLink?: string;
	createdAt: string;
	source: 'unsplash' | 'local';
	licenseName?: string;
	licenseUrl?: string;
	idbKey?: string;
};
