import Card from './Card';

export default class Slider {
	card: Card;
	sliderData: SliderData;
	slideIndex: number = 1;
	constructor(sliderData: SliderData, card: Card) {
		this.sliderData = sliderData;
		this.card = card;
	}

	createSlider() {
		const sliderWrapper = document.createElement('div');
		sliderWrapper.classList.add('slider-wrapper');
		document.body.appendChild(sliderWrapper);

		const slider = document.createElement('div');
		slider.classList.add('slider');
		sliderWrapper.appendChild(slider);

		const sliderSlides = document.createElement('div');
		sliderSlides.classList.add('slider-slides');
		slider.appendChild(sliderSlides);

		if (this.sliderData.arrows) {
			const sliderArrows = document.createElement('div');
			sliderArrows.classList.add('slider-arrows');
			slider.appendChild(sliderArrows);

			const prevButton = document.createElement('span');
			prevButton.classList.add('slider-arrow');
			prevButton.classList.add('slider-arrow-prev');
			prevButton.textContent = '❮';
			prevButton.onclick = () => this.previousSlide();
			sliderArrows.appendChild(prevButton);

			const nextButton = document.createElement('span');
			nextButton.classList.add('slider-arrow');
			nextButton.classList.add('slider-arrow-next');
			nextButton.textContent = '❯';
			nextButton.onclick = () => this.nextSlide();
			sliderArrows.appendChild(nextButton);
		}

		if (this.sliderData.dots) {
			const sliderDots = document.createElement('div');
			sliderDots.classList.add('slider-dots');
			sliderWrapper.appendChild(sliderDots);

			this.sliderData.slides?.forEach((_: CardData, index: number) => {
				const dot = document.createElement('input');
				dot.type = 'radio';
				dot.name = `slider-dot`;
				dot.classList.add('slider-dot');
				dot.classList.add('slider-dot-blue');
				dot.value = `slider-dot-${index}`;
				if (index === 0) {
					dot.setAttribute('checked', '');
				}
				dot.onclick = () => {
					this.slideIndex = index + 1;
					this.showSlides(this.slideIndex);
				};
				sliderDots.appendChild(dot);
			});
		}

		return sliderWrapper;
	}

	showSlides(sliderIndex: number) {
		let index: number;
		let dots: NodeListOf<HTMLElement> = {} as NodeListOf<HTMLElement>;
		let slides: NodeListOf<HTMLElement> =
			document.querySelectorAll('.slider-slides');

		if (this.sliderData.dots) {
			dots = document.querySelectorAll('.slider-dots');
		}

		if (sliderIndex > slides.length) {
			this.slideIndex = 1;
		}
		if (sliderIndex < slides.length) {
			this.slideIndex = sliderIndex;
		}

		if (this.sliderData.dots) {
			for (index = 0; index < dots.length; index++) {
				dots[index].classList.toggle('slider-dots-active');
			}
		}

		let slideIndex = this.slideIndex - 1;

		slides[slideIndex].style.display = 'block';
		if (this.sliderData.dots) {
			dots[slideIndex].classList.toggle('slider-dots-active');
		}

		console.log({
			currentSliderIndex: this.slideIndex,
			sliderIndex: sliderIndex,
		});
	}

	previousSlide() {
		this.slideIndex -= 1;
		this.showSlides(this.slideIndex);
	}

	nextSlide() {
		this.slideIndex += 1;
		this.showSlides(this.slideIndex);
	}
}
