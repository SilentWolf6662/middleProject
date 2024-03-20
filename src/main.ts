import './style.scss';

import Card from './components/Card';
import Slider from './components/Slider';
import data from './../assets/json/data.json';

(() => {
	const products = data.products;
	const app = document.querySelector('#app');

	const container = document.createElement('div');
	container.classList.add('container');
	app?.appendChild(container);

	let cards: HTMLElement[] = [];
	products.forEach((product) => {
		const card = new Card(product).createCard();
		cards.push(card);
	});

	const slider = new Slider({
		amount: 3,
		autoplay: true,
		autoplaySpeed: 3000,
		dots: true,
		arrows: true,
		infinite: true,
		slides: cards,
	}).createSlider();

	container.appendChild(slider);
})();
