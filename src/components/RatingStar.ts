import stars from '../../assets/images/stars.svg';

export default class RatingStar {
	constructor() {}

	createRatingProgressbar(ratingAmount: number, rating?: number) {
		const starPath =
			'M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z M0 0 h24 v24 h-24 v-24';
		const ratingProgressbar = document.createElement('div');
		ratingProgressbar.classList.add('rating');
		document.body.appendChild(ratingProgressbar);

		const ratingProgressbarFill = document.createElement('div');
		ratingProgressbarFill.classList.add('rating-bg');
		ratingProgressbar.appendChild(ratingProgressbarFill);

		const ratingProgressbarProgress = document.createElement('progress');
		ratingProgressbarProgress.classList.add('rating-bg');
		ratingProgressbarProgress.max = ratingAmount;
		ratingProgressbarProgress.value = rating || 0;
		ratingProgressbar.appendChild(ratingProgressbarProgress);

		const stars = document.createElement('svg');
		stars.style.display = 'none';
		const starsDefs = document.createElement('defs');
		stars.appendChild(starsDefs);
		const starsSymbol = document.createElement('symbol');
		starsSymbol.id = 'fivestars';
		for (
			let index = 0, translate = 0;
			index < ratingAmount;
			index += 1, translate += 24
		) {
			let path = document.createElement('path');
			path.setAttribute('d', starPath);
			path.setAttribute('fill', 'white');
			path.setAttribute('fill-rule', 'evenodd');
			if (index < (rating || 0)) path.setAttribute('fill', 'orange');
			if (index !== 0)
				path.setAttribute('transform', `translate(${translate})`);
			starsSymbol.appendChild(path);
		}
		starsDefs.appendChild(starsSymbol);

		ratingProgressbar.appendChild(stars);

		return ratingProgressbar;
	}

	createRatingStars(ratingAmount: number, rating?: number) {
		const emptyStar = '☆';
		const fullStar = '★';

		const ratingStars = document.createElement('div');
		ratingStars.classList.add('card-rating-stars');
		let stars = '';
		for (let i = 0; i < ratingAmount; i++) {
			if (i < (rating || 0)) stars += fullStar;
			else stars += emptyStar;
		}
		ratingStars.textContent = stars;
		document.body.appendChild(ratingStars);

		return ratingStars;
	}
}
