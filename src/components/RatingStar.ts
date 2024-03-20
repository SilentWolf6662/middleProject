export default class RatingStar {
	constructor() {}

	createRatingStars(ratingAmount: number, rating?: number) {
		console.log('RatingStar component');
		const emptyStar = '☆';
		const fullStar = '★';

		const ratingStars = document.createElement('div');
		ratingStars.classList.add('rating-stars');
		let rate = rating || 0;
		let stars = '';
		for (let i = 0; i < ratingAmount; i++) {
			if (i < rate) stars += fullStar;
			else stars += emptyStar;
		}
		ratingStars.textContent = stars;
		document.body.appendChild(ratingStars);

		return ratingStars;
	}
}
