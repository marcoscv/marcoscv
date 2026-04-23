function applyTheme(theme) {
	document.body.removeAttribute('data-bs-theme');

	if (theme === 'dark') {
		document.body.setAttribute('data-bs-theme', 'dark');
	} else if (theme === 'light') {
		document.body.setAttribute('data-bs-theme', 'light');
	} else {
		detectTheme();
	}

	updateActiveButton(theme);
}

function detectTheme() {
	const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
	if (prefersDarkScheme.matches) {
		document.body.setAttribute('data-bs-theme', 'dark');
	} else {
		document.body.setAttribute('data-bs-theme', 'light');
	}
}

function savePreference(theme) {
	localStorage.setItem('theme', theme);
}

function loadTheme() {
	const savedTheme = localStorage.getItem('theme');
	if (savedTheme) {
		applyTheme(savedTheme);
	} else {
		detectTheme();
	}
}

function updateActiveButton(theme) {
	const buttons = document.querySelectorAll('.theme-btn');
	buttons.forEach((button) => button.classList.remove('active'));
	const newIcon = document.querySelector('.nuevo-icono');
	let darkButton;
	newIcon.innerHTML = '';

	if (theme === 'dark') {
		darkButton = document.querySelector('#btn-dark svg');
		document.getElementById('btn-dark').classList.add('active');
	} else if (theme === 'light') {
		darkButton = document.querySelector('#btn-light svg');
		document.getElementById('btn-light').classList.add('active');
	} else {
		darkButton = document.querySelector('#btn-os svg');
		document.getElementById('btn-os').classList.add('active');
	}

	const clonedSVG = darkButton.cloneNode(true);
	newIcon.appendChild(clonedSVG);
}

document.getElementById('btn-dark').addEventListener('click', () => {
	applyTheme('dark');
	savePreference('dark');
});

document.getElementById('btn-light').addEventListener('click', () => {
	applyTheme('light');
	savePreference('light');
});

document.getElementById('btn-os').addEventListener('click', () => {
	applyTheme('os');
	savePreference('os');
});

loadTheme();

// Toast and Dropdown

// const tooltipTriggerList = document.querySelectorAll('[title]');
// const tooltipList = [...tooltipTriggerList].map(
// 	(tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
// );

// const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
// const dropdownList = [...dropdownElementList].map(
// 	(dropdownToggleEl) => new bootstrap.Dropdown(dropdownToggleEl)
// );

const gifContainers = document.querySelectorAll('.gif-container');
const mediaVideos = [...document.querySelectorAll('.gif-container video')];

function stopVideo(video) {
	video.currentTime = 0;
	video.pause();
	video.removeAttribute('controls');
	video.closest('.gif-container')?.classList.remove('playing');
}

function stopOtherVideos(currentVideo) {
	mediaVideos.forEach((otherVideo) => {
		if (otherVideo !== currentVideo) {
			stopVideo(otherVideo);
		}
	});
}

mediaVideos.forEach((video) => {
	video.addEventListener('play', () => {
		stopOtherVideos(video);
		video.closest('.gif-container')?.classList.add('playing');
	});
});

gifContainers.forEach((container) => {
	const image = container.querySelector('.gif, .jpg, .png');
	const video = container.querySelector('video');

	if (!image && !video) return; // Si no hay imagen ni video, saltamos este contenedor

	if (image && !image.hasAttribute('data-static')) {
		image.setAttribute('data-static', image.src);
	}

	if (video && !video.hasAttribute('data-static')) {
		const poster = video.getAttribute('poster');
		if (poster) {
			video.setAttribute('data-static', poster);
		}
	}

	if (video) {
		video.addEventListener('pause', () => {
			if (video.currentTime === 0 || video.ended) {
				video.removeAttribute('controls');
			}
			container.classList.remove('playing');
		});

		video.addEventListener('ended', () => {
			stopVideo(video);
		});
	}

	const toggleMedia = () => {
		if (image) {
			const isPlaying = image.src === image.dataset.animated;
			image.src = isPlaying
				? image.dataset.static
				: image.dataset.animated;
			container.classList.toggle('playing', !isPlaying);
		}

		if (video) {
			if (video.paused) {
				video.play();

				setTimeout(() => {
					video.setAttribute('controls', '');
				}, '500');
			} else {
				stopVideo(video);
			}
		}
	};

	container.addEventListener('click', toggleMedia);
	container.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleMedia();
		}
	});
});

function showAllPictures() {
	document
		.querySelectorAll('.col-sm-6.d-none')
		.forEach((div) => div.classList.remove('d-none'));
	document.querySelector('.btn-seeAll').remove();
}

// Animations:

// animScoll with animate.css
const observer = new IntersectionObserver((entries, observer) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			const animationClass =
				entry.target.getAttribute('data-animation') || 'fadeIn';
			entry.target.classList.add(
				'animate__animated',
				`animate__${animationClass}`,
				'visible'
			);
			observer.unobserve(entry.target);
		}
	});
});

const items = [...document.querySelectorAll('[data-animation]')];

items.forEach((item) => {
	item.classList.add('onScroll');

	observer.observe(item);
});

/*
 *   Slider example from W3C (Pretty old :)
 */

var CarouselPreviousNext = function (node, options) {
	options = Object.assign(
		{moreaccessible: false, paused: false, norotate: false},
		options || {}
	);

	var hasReducedMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)'
	);
	if (hasReducedMotion.matches) {
		options.paused = true;
	}

	/* DOM properties */
	this.domNode = node;

	this.carouselItemNodes = node.querySelectorAll('.carousel-item');

	this.containerNode = node.querySelector('.carousel-items');
	this.liveRegionNode = node.querySelector('.carousel-items');
	this.pausePlayButtonNode = null;
	this.previousButtonNode = null;
	this.nextButtonNode = null;

	this.playLabel = 'Start automatic slide show';
	this.pauseLabel = 'Stop automatic slide show';

	/* State properties */
	this.hasUserActivatedPlay = false;
	this.isAutoRotationDisabled = options.norotate;
	this.isPlayingEnabled = !options.paused;
	this.timeInterval = 5000;
	this.currentIndex = 0;
	this.slideTimeout = null;

	var elem = document.querySelector('.carousel .controls button.rotation');
	if (elem) {
		this.pausePlayButtonNode = elem;
		this.pausePlayButtonNode.addEventListener(
			'click',
			this.handlePausePlayButtonClick.bind(this)
		);
	}

	// Previous Button

	elem = document.querySelector('.carousel .controls button.previous');
	if (elem) {
		this.previousButtonNode = elem;
		this.previousButtonNode.addEventListener(
			'click',
			this.handlePreviousButtonClick.bind(this)
		);
		this.previousButtonNode.addEventListener(
			'focus',
			this.handleFocusIn.bind(this)
		);
		this.previousButtonNode.addEventListener(
			'blur',
			this.handleFocusOut.bind(this)
		);
	}

	// Next Button

	elem = document.querySelector('.carousel .controls button.next');
	if (elem) {
		this.nextButtonNode = elem;
		this.nextButtonNode.addEventListener(
			'click',
			this.handleNextButtonClick.bind(this)
		);
		this.nextButtonNode.addEventListener(
			'focus',
			this.handleFocusIn.bind(this)
		);
		this.nextButtonNode.addEventListener(
			'blur',
			this.handleFocusOut.bind(this)
		);
	}

	// Carousel item events

	for (var i = 0; i < this.carouselItemNodes.length; i++) {
		var carouselItemNode = this.carouselItemNodes[i];

		// support stopping rotation when any element receives focus in the tabpanel
		carouselItemNode.addEventListener(
			'focusin',
			this.handleFocusIn.bind(this)
		);
		carouselItemNode.addEventListener(
			'focusout',
			this.handleFocusOut.bind(this)
		);

		var imageLinkNode = carouselItemNode.querySelector('.carousel-image a');

		if (imageLinkNode) {
			imageLinkNode.addEventListener(
				'focus',
				this.handleImageLinkFocus.bind(this)
			);
			imageLinkNode.addEventListener(
				'blur',
				this.handleImageLinkBlur.bind(this)
			);
		}
	}

	// Handle hover events
	this.domNode.addEventListener('mouseover', this.handleMouseOver.bind(this));
	this.domNode.addEventListener('mouseout', this.handleMouseOut.bind(this));

	// initialize behavior based on options

	this.enableOrDisableAutoRotation(options.norotate);
	this.updatePlaying(!options.paused && !options.norotate);
	this.setAccessibleStyling(options.moreaccessible);
	this.rotateSlides();
};

/* Public function to disable/enable rotation and if false, hide pause/play button*/
CarouselPreviousNext.prototype.enableOrDisableAutoRotation = function (
	disable
) {
	this.isAutoRotationDisabled = disable;
	this.pausePlayButtonNode.hidden = disable;
};

/* Public function to update controls/caption styling */
CarouselPreviousNext.prototype.setAccessibleStyling = function (accessible) {
	if (accessible) {
		this.domNode.classList.add('carousel-moreaccessible');
	} else {
		this.domNode.classList.remove('carousel-moreaccessible');
	}
};

CarouselPreviousNext.prototype.showCarouselItem = function (index) {
	this.currentIndex = index;

	for (var i = 0; i < this.carouselItemNodes.length; i++) {
		var carouselItemNode = this.carouselItemNodes[i];
		if (index === i) {
			carouselItemNode.classList.add('active');
		} else {
			carouselItemNode.classList.remove('active');
		}
	}
};

CarouselPreviousNext.prototype.previousCarouselItem = function () {
	var nextIndex = this.currentIndex - 1;
	if (nextIndex < 0) {
		nextIndex = this.carouselItemNodes.length - 1;
	}
	this.showCarouselItem(nextIndex);
};

CarouselPreviousNext.prototype.nextCarouselItem = function () {
	var nextIndex = this.currentIndex + 1;
	if (nextIndex >= this.carouselItemNodes.length) {
		nextIndex = 0;
	}
	this.showCarouselItem(nextIndex);
};

CarouselPreviousNext.prototype.rotateSlides = function () {
	if (!this.isAutoRotationDisabled) {
		if (
			(!this.hasFocus && !this.hasHover && this.isPlayingEnabled) ||
			this.hasUserActivatedPlay
		) {
			this.nextCarouselItem();
		}
	}

	this.slideTimeout = setTimeout(
		this.rotateSlides.bind(this),
		this.timeInterval
	);
};

CarouselPreviousNext.prototype.updatePlaying = function (play) {
	this.isPlayingEnabled = play;

	if (play) {
		this.pausePlayButtonNode.setAttribute(
			'data-bs-original-title',
			this.pauseLabel
		);
		this.pausePlayButtonNode.classList.remove('play');
		this.pausePlayButtonNode.classList.add('pause');
		this.liveRegionNode.setAttribute('aria-live', 'off');
	} else {
		this.pausePlayButtonNode.setAttribute(
			'data-bs-original-title',
			this.playLabel
		);
		this.pausePlayButtonNode.classList.remove('pause');
		this.pausePlayButtonNode.classList.add('play');
		this.liveRegionNode.setAttribute('aria-live', 'polite');
	}
};

/* Event Handlers */

CarouselPreviousNext.prototype.handleImageLinkFocus = function () {
	this.liveRegionNode.classList.add('focus');
};

CarouselPreviousNext.prototype.handleImageLinkBlur = function () {
	this.liveRegionNode.classList.remove('focus');
};

CarouselPreviousNext.prototype.handleMouseOver = function (event) {
	if (!this.pausePlayButtonNode.contains(event.target)) {
		this.hasHover = true;
	}
};

CarouselPreviousNext.prototype.handleMouseOut = function () {
	this.hasHover = false;
};

/* EVENT HANDLERS */

CarouselPreviousNext.prototype.handlePausePlayButtonClick = function () {
	this.hasUserActivatedPlay = !this.isPlayingEnabled;
	this.updatePlaying(!this.isPlayingEnabled);
};

CarouselPreviousNext.prototype.handlePreviousButtonClick = function () {
	this.previousCarouselItem();
};

CarouselPreviousNext.prototype.handleNextButtonClick = function () {
	this.nextCarouselItem();
};

/* Event Handlers for carousel items*/

CarouselPreviousNext.prototype.handleFocusIn = function () {
	this.liveRegionNode.setAttribute('aria-live', 'polite');
	this.hasFocus = true;
};

CarouselPreviousNext.prototype.handleFocusOut = function () {
	if (this.isPlayingEnabled) {
		this.liveRegionNode.setAttribute('aria-live', 'off');
	}
	this.hasFocus = false;
};

/* Initialize Carousel and options */

window.addEventListener(
	'load',
	function () {
		var carouselEls = document.querySelectorAll('.carousel');
		var carousels = [];

		var checkboxes = document.querySelectorAll(
			'.carousel-options input[type=checkbox]'
		);
		var urlParams = new URLSearchParams(location.search);
		var carouselOptions = {};

		checkboxes.forEach(function (checkbox) {
			var checked = checkbox.checked;

			if (urlParams.has(checkbox.value)) {
				var urlParam = urlParams.get(checkbox.value);
				if (typeof urlParam === 'string') {
					checked = urlParam === 'true';
					checkbox.checked = checked;
				}
			}

			carouselOptions[checkbox.value] = checkbox.checked;
		});

		carouselEls.forEach(function (node) {
			carousels.push(new CarouselPreviousNext(node, carouselOptions));
		});

		checkboxes.forEach(function (checkbox) {
			var updateEvent;
			switch (checkbox.value) {
				case 'moreaccessible':
					updateEvent = 'setAccessibleStyling';
					break;
				case 'norotate':
					updateEvent = 'enableOrDisableAutoRotation';
					break;
			}

			checkbox.addEventListener('change', function (event) {
				urlParams.set(event.target.value, event.target.checked + '');
				window.history.replaceState(
					null,
					'',
					window.location.pathname + '?' + urlParams
				);

				if (updateEvent) {
					carousels.forEach(function (carousel) {
						carousel[updateEvent](event.target.checked);
					});
				}
			});
		});
	},
	false
);
