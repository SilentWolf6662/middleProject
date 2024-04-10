import './style.scss';

import Card from './components/Card';
import RatingStar from './components/RatingStar';
import Slider from './components/Slider';
import data from './../assets/json/data.json';

(() => {
	const products = data.products;
	const app = document.querySelector('#app');

	const container = document.createElement('div');
	container.classList.add('container');
	app?.appendChild(container);

	const RS = new RatingStar();

	const card = new Card({
		id: products[0].id,
		title: products[0].name,
		contentText: products[0].description,
		imageSrc: products[0].imageSrc,
		imageAlt: products[0].name,
		price: products[0].price,
		rating: products[0].rating,
	});
	const cardToAdd = card.createCard(RS);

	const slider = new Slider(
		{
			amount: 3,
			autoplay: true,
			autoplaySpeed: 3000,
			dots: false,
			arrows: false,
			infinite: true,
			slides: products,
			card: card,
		},
		card,
		RS,
	).createSlider();

	document.querySelector('.slider-slides')?.appendChild(cardToAdd);

	container.appendChild(slider);
})();
