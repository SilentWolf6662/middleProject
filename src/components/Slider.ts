// Importing the Card and RatingStar components

import Card from './Card';
import RatingStar from './RatingStar';
import gsap from 'gsap';

// Defining the Slider class
export default class Slider {
	// Properties for the Card, RatingStar, and SliderData
	card: Card = {} as Card;
	RS: RatingStar = {} as RatingStar;
	sliderData: SliderData = {} as SliderData;
	// Index to keep track of the current slide
	slideIndex: number = 0;

	// Constructor to initialize the Slider with data, Card, and RatingStar
	/**
	 * Constructor for the Slider class
	 * @param sliderData SliderData
	 * @param card Card
	 * @param RS RatingStar
	 * @constructor
	 */
	constructor(sliderData: SliderData, card: Card, RS: RatingStar) {
		this.sliderData = sliderData;
		this.card = card;
		this.RS = RS;
	}

	/**
	 * Method to create the slider and its components
	 * @method createSlider
	 * @returns {HTMLElement} The slider wrapper element
	 */
	createSlider(): HTMLElement {
		// Create the slider wrapper and add it to the body
		const sliderWrapper = document.createElement('div');
		sliderWrapper.classList.add('slider-wrapper');
		document.body.appendChild(sliderWrapper);

		// Create the slider and add it to the wrapper
		const slider = document.createElement('div');
		slider.classList.add('slider');
		sliderWrapper.appendChild(slider);

		// Create the container for the slides and add it to the slider
		const sliderSlides = document.createElement('div');
		sliderSlides.classList.add('slider-slides');
		slider.appendChild(sliderSlides);

		// If arrows are enabled, create and add them to the slider
		if (this.sliderData.arrows) {
			const sliderArrows = document.createElement('div');
			sliderArrows.classList.add('slider-arrows');
			slider.appendChild(sliderArrows);

			// Create and add the previous arrow
			const prevButton = document.createElement('span');
			prevButton.classList.add('slider-arrow');
			prevButton.classList.add('slider-arrow-prev');
			prevButton.textContent = '❮';
			prevButton.setAttribute('aria-label', 'Previous slide');
			prevButton.addEventListener('click', () => this.changeSlide(true));
			sliderArrows.appendChild(prevButton);

			// Create and add the next arrow
			const nextButton = document.createElement('span');
			nextButton.classList.add('slider-arrow');
			nextButton.classList.add('slider-arrow-next');
			nextButton.textContent = '❯';
			nextButton.setAttribute('aria-label', 'Next slide');
			nextButton.addEventListener('click', () => this.changeSlide(false));
			sliderArrows.appendChild(nextButton);
		}

		// Add event listeners for touch events to handle swiping
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

		// Add event listener for keyboard navigation
		document.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowLeft') {
				this.changeSlide(true);
			} else if (event.key === 'ArrowRight') {
				this.changeSlide(false);
			}
		});

		// If dots are enabled, create and add them to the slider
		if (this.sliderData.dots) {
			const sliderDots = document.createElement('div');
			sliderDots.classList.add('slider-dots');
			sliderWrapper.appendChild(sliderDots);

			// Create and add a dot for each slide
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

		// If autoplay is enabled, create and add the autoplay control
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

		// Return the slider wrapper
		return sliderWrapper;
	}

	/**
	 * Method to show the slides based on the given index
	 * @method showSlides
	 * @param sliderIndex number
	 * @returns void
	 */
	showSlides(sliderIndex: number) {
		let dots: NodeListOf<HTMLInputElement> | null = null;
		const slides = this.sliderData.slides;
		if (slides === undefined || slides.length === 0) {
			throw new Error('No slider data found');
		}

		if (this.sliderData.dots) {
			dots = document.querySelectorAll('.slider-dot');
		}

		// Update the slideIndex based on the given index
		if (sliderIndex > slides?.length - 1) {
			this.slideIndex = 0;
		} else if (sliderIndex < 0) {
			this.slideIndex = slides?.length - 1;
		} else {
			this.slideIndex = sliderIndex;
		}

		// Update the dots to reflect the current slide
		if (this.sliderData.dots && dots) {
			const dotIndex = this.slideIndex;
			const dotIndex2 = (this.slideIndex - 1) % dots.length;

			dots.forEach((dot, index) => {
				dot.checked = index === dotIndex || index === dotIndex2;
			});
		}

		// Update the card content based on the current slide
		/*gsap.to(, {
			duration: 0.6,
			y: -100,
			opacity: 0,
			ease: 'power2.in',
			yoyo: true,
			repeat: 1,
		}); */
		this.card.changeContent(slides[this.slideIndex], this.RS);
	}

	/**
	 * Method to navigate to the next slide or previous slide
	 * @method changeSlide
	 * @returns void
	 */
	changeSlide(prev: boolean) {
		this.stopAutoplay();
		if (prev) this.slideIndex -= 1;
		else this.slideIndex += 1;
		this.showSlides(this.slideIndex);
		this.startAutoplay();
	}

	// Variables to track touch events for swiping
	touchStartX: number = 0;
	touchEndX: number = 0;
	swipeThreshold: number = 50;

	/**
	 * Method to handle the start of a touch event
	 * @param event TouchEvent
	 * @returns void
	 */
	handleTouchStart(event: TouchEvent) {
		// Store the initial touch position
		this.touchStartX = event.touches[0].clientX;
	}

	/**
	 * Method to handle the movement of a touch event
	 * @param event TouchEvent
	 * @returns void
	 */
	handleTouchMove(event: TouchEvent) {
		// Prevent the default behavior to allow for smooth scrolling
		event.preventDefault();
	}

	/**
	 * Method to handle the end of a touch event
	 * @param event TouchEvent
	 * @returns void
	 */
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
			this.changeSlide(false);
		} else if (swipeDirection < 0) {
			// Swipe right, navigate to the previous slide
			this.changeSlide(true);
		}
	}

	// Variable to store the autoplay interval
	autoplayInterval: number | null = null;

	/**
	 * Method to start autoplay
	 * @method startAutoplay
	 * @returns void
	 */
	startAutoplay() {
		if (this.autoplayInterval !== null) {
			return; // Autoplay is already running
		}

		const autoPlayControl = document.querySelector(
			'.autoplay-control',
		) as HTMLButtonElement;
		autoPlayControl.textContent = 'Pause';

		this.autoplayInterval = setInterval(() => {
			this.changeSlide(false);
		}, this.sliderData.autoplaySpeed);
	}

	/**
	 * Method to stop autoplay
	 * @method stopAutoplay
	 * @returns void
	 */
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

	/**
	 * Method to toggle autoplay on and off
	 * @method toggleAutoplay
	 * @returns void
	 */
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
