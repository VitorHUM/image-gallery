export type UnsplashUser = { name: string; links: { html: string } };

export type UnsplashPhoto = {
	id: string;
	urls: { small: string; regular: string };
	width: number;
	height: number;
	description: string | null;
	alt_description: string | null;
	user: UnsplashUser;
	created_at: string;
	links: { html: string; download?: string; download_location?: string };
};

export type PhotoItem = {
	id: string;
	urlSmall: string;
	urlRegular: string;
	width: number;
	height: number;
	description?: string | null;
	author: string;
	photoLink?: string;
	createdAt: string;
};
