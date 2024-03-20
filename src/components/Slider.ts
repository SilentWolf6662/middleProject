export default class Slider {
	sliderData: SliderData;
	slideIndex: number = 1;
	constructor(sliderData: SliderData) {
		this.sliderData = sliderData;
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

		this.sliderData.slides?.forEach((slide, index) => {
			slide.classList.add('slider-slide');
			if (index === 0) {
				slide.classList.add('slider-slide-active');
			}
			sliderSlides.appendChild(slide);
		});

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
			this.sliderData.slides?.forEach((_, index) => {
				const dot = document.createElement('span');
				dot.classList.add('slider-dot');
				dot.onclick = () =>
					this.showSlides((this.slideIndex = index + 1));
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

		slides[this.slideIndex - 1].style.display = 'block';
		if (this.sliderData.dots) {
			//console.log({ dot: this.slideIndex - 1 });
			dots[this.slideIndex - 1].classList.toggle('slider-dots-active');
		}

		this.sliderData.slides?.forEach((slide, index) => {
			if (index === this.slideIndex - 1) {
				slide.classList.add('slider-slide-active');
			} else {
				slide.classList.remove('slider-slide-active');
			}
		});

		console.log({
			currentSliderIndex: this.slideIndex,
			sliderIndex: sliderIndex,
		});
	}

	previousSlide() {
		this.showSlides((this.slideIndex -= 1));
	}

	nextSlide() {
		this.showSlides((this.slideIndex += 1));
	}
}
