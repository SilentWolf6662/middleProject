import RatingStar from './RatingStar';

export default class Card {
	cardData: CardData;
	constructor(cardData: CardData) {
		this.cardData = cardData;
	}

	createCard(RS: RatingStar) {
		const cardWrapper = document.createElement('div');
		cardWrapper.classList.add('card-wrapper');
		document.body.appendChild(cardWrapper);

		const card = document.createElement('div');
		card.classList.add('card');
		cardWrapper.appendChild(card);

		const cardRating = document.createElement('div');
		cardRating.classList.add('card-rating');
		cardRating.textContent = `${this.cardData.rating || 0}`;
		card.appendChild(cardRating);

		const cardRatingStar = RS.createRatingStars(5, this.cardData.rating);
		cardRating.appendChild(cardRatingStar);

		const cardTitle = document.createElement('h2');
		cardTitle.classList.add('card-title');
		cardTitle.textContent = this.cardData.title || 'Card title';
		card.appendChild(cardTitle);

		const cardImage = document.createElement('img');
		cardImage.classList.add('card-image');

		cardImage.src = this.cardData.imageSrc
			? `./assets/images/${this.cardData.imageSrc}`
			: 'https://via.placeholder.com/150';
		cardImage.alt = this.cardData.imageAlt || 'Placeholder image';
		card.appendChild(cardImage);

		const cardContent = document.createElement('div');
		cardContent.classList.add('card-content');
		cardContent.textContent = this.cardData.contentText || 'Card content';
		card.appendChild(cardContent);

		const cardPrice = document.createElement('div');
		cardPrice.classList.add('card-price');
		cardPrice.textContent = `${this.cardData.price || 0}`;
		card.appendChild(cardPrice);

		return cardWrapper;
	}

	changeContent(dataToUpdate: any, RS: RatingStar) {
		const card = document.querySelector('.card');

		const cardContent = card?.querySelector('.card-content');
		if (cardContent) {
			cardContent.textContent = dataToUpdate.description || 'New content';
		}

		const cardPrice = card?.querySelector('.card-price');
		if (cardPrice) {
			cardPrice.textContent = `${dataToUpdate.price || 0}`;
		}

		RS.updateRatingStars(5, dataToUpdate.rating || 0);

		const cardImage = card?.querySelector(
			'.card-image',
		) as HTMLImageElement;

		if (cardImage) {
			cardImage.src = dataToUpdate.imageSrc
				? `./assets/images/${dataToUpdate.imageSrc}`
				: 'https://via.placeholder.com/150';
		}

		const cardTitle = card?.querySelector('.card-title');
		if (cardTitle) {
			cardTitle.textContent = dataToUpdate.name || 'New title';
		}

		return card;
	}
}
