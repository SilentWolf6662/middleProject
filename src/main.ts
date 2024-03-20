import './style.scss';

import Card from './components/Card';
import data from './../assets/json/data.json';

(() => {
	const products = data.products;
	const app = document.querySelector('#app');

	const container = document.createElement('div');
	container.classList.add('container');
	app?.appendChild(container);

	const testCardData: CardData = {
		imageSrc: products[0].imageSrc,
		title: products[0].name,
		contentText: products[0].description,
		price: products[0].price,
		rating: products[0].rating,
	};
	const card = new Card(testCardData).createCard();
	container.appendChild(card);
})();
