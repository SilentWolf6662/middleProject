interface CardData {
	id?: number;
	title?: string;
	contentText?: string;
	imageSrc?: string;
	imageAlt?: string;
	price?: number;
	rating?: number;
}

interface SliderData {
	amount?: number;
	arrows?: boolean;
	autoplay?: boolean;
	autoplaySpeed?: number;
	dots?: boolean;
	infinite?: boolean;
	slides?: Card;
	card: Card;
}
