import Card from './Card';
import RatingStar from './RatingStar';

export default class Slider {
	card: Card;
	RS: RatingStar;
	sliderData: SliderData;
	slideIndex: number = 0;
	constructor(sliderData: SliderData, card: Card, RS: RatingStar) {
		this.sliderData = sliderData;
		this.card = card;
		this.RS = RS;
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
			prevButton.setAttribute('aria-label', 'Previous slide');
			prevButton.addEventListener('click', () => this.previousSlide());
			sliderArrows.appendChild(prevButton);

			const nextButton = document.createElement('span');
			nextButton.classList.add('slider-arrow');
			nextButton.classList.add('slider-arrow-next');
			nextButton.textContent = '❯';
			nextButton.setAttribute('aria-label', 'Next slide');
			nextButton.addEventListener('click', () => this.nextSlide());
			sliderArrows.appendChild(nextButton);
		}

		sliderWrapper.addEventListener(
			'touchstart',
			this.handleTouchStart.bind(this),
		);
		sliderWrapper.addEventListener(
			'touchmove',
			this.handleTouchMove.bind(this),
		);
		sliderWrapper.addEventListener(
			'touchend',
			this.handleTouchEnd.bind(this),
		);

		document.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowLeft') {
				this.previousSlide();
			} else if (event.key === 'ArrowRight') {
				this.nextSlide();
			}
		});

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
				dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
				dot.setAttribute('role', 'button');
				if (index === 0) {
					dot.setAttribute('checked', '');
				}
				dot.addEventListener('click', () => {
					this.toggleAutoplay();
					// Check if the clicked dot's index matches the current slideIndex
					if (index === this.slideIndex) {
						// If they match, do nothing and return early
						return;
					}

					// Otherwise, update the slideIndex and show the new slide
					this.slideIndex = index;
					this.showSlides(this.slideIndex);
					this.toggleAutoplay();
				});
				sliderDots.appendChild(dot);
			});
		}

		if (this.sliderData.autoplay) {
			const autoplayControl = document.createElement('button');
			autoplayControl.classList.add('autoplay-control');
			autoplayControl.textContent = 'Pause'; // Default state is play
			sliderWrapper.appendChild(autoplayControl);

			autoplayControl.addEventListener('click', () => {
				this.toggleAutoplay();
			});

			this.startAutoplay();
		}

		return sliderWrapper;
	}

	showSlides(sliderIndex: number) {
		let dots: NodeListOf<HTMLInputElement> | null = null;
		const slides = this.sliderData.slides;
		if (slides === undefined || slides.length === 0) {
			throw new Error('No slider data found');
		}

		if (this.sliderData.dots) {
			dots = document.querySelectorAll('.slider-dot');
		}

		if (sliderIndex > slides?.length - 1) {
			this.slideIndex = 0;
		} else if (sliderIndex < 0) {
			this.slideIndex = slides?.length - 1;
		} else {
			this.slideIndex = sliderIndex;
		}

		if (this.sliderData.dots && dots) {
			const dotIndex = this.slideIndex;
			const dotIndex2 = (this.slideIndex - 1) % dots.length;

			dots.forEach((dot, index) => {
				dot.checked = index === dotIndex || index === dotIndex2;
			});
		}

		this.card.changeContent(slides[this.slideIndex], this.RS);
	}

	previousSlide() {
		this.toggleAutoplay();
		this.slideIndex -= 1;
		this.showSlides(this.slideIndex);
		this.toggleAutoplay();
	}

	nextSlide() {
		this.toggleAutoplay();
		this.slideIndex += 1;
		this.showSlides(this.slideIndex);
		this.toggleAutoplay();
	}

	touchStartX: number = 0;
	touchEndX: number = 0;
	swipeThreshold: number = 50;

	handleTouchStart(event: TouchEvent) {
		// Store the initial touch position
		this.touchStartX = event.touches[0].clientX;
	}

	handleTouchMove(event: TouchEvent) {
		// Prevent the default behavior to allow for smooth scrolling
		event.preventDefault();
	}

	handleTouchEnd(event: TouchEvent) {
		// Store the final touch position
		this.touchEndX = event.changedTouches[0].clientX;

		// Calculate the swipe distance
		const swipeDistance = Math.abs(this.touchStartX - this.touchEndX);

		// Calculate the swipe direction
		const swipeDirection = this.touchStartX - this.touchEndX;

		// Navigate based on swipe direction if the swipe distance exceeds the threshold
		if (swipeDistance <= this.swipeThreshold) return;
		if (swipeDirection > 0) {
			// Swipe left, navigate to the next slide
			this.nextSlide();
		} else if (swipeDirection < 0) {
			// Swipe right, navigate to the previous slide
			this.previousSlide();
		}
	}

	autoplayInterval: number | null = null;

	startAutoplay() {
		if (this.autoplayInterval !== null) {
			return; // Autoplay is already running
		}

		const autoPlayControl = document.querySelector(
			'.autoplay-control',
		) as HTMLButtonElement;
		autoPlayControl.textContent = 'Pause';

		this.autoplayInterval = setInterval(() => {
			this.nextSlide();
		}, this.sliderData.autoplaySpeed);
	}

	stopAutoplay() {
		if (this.autoplayInterval !== null) {
			const autoPlayControl = document.querySelector(
				'.autoplay-control',
			) as HTMLButtonElement;
			autoPlayControl.textContent = 'Play';

			clearInterval(this.autoplayInterval);
			this.autoplayInterval = null;
		}
	}

	toggleAutoplay() {
		const autoPlayControl = document.querySelector('.autoplay-control');
		if (!autoPlayControl) return;
		if (this.autoplayInterval !== null) {
			this.stopAutoplay();
		} else {
			this.startAutoplay();
		}
	}
}
