'use strict';
const places = {
    cityMoscow: [55.52383047102143,37.66376281162271],
    placemarkMoscow: [56.00117074769137,37.475357846672075],
}

function init() {
    let map = new ymaps.Map('yandex-map', {
        center: places.cityMoscow,
        zoom: 7,
        controls: []
    });

    let placemarkShop = new ymaps.Placemark(places.placemarkMoscow, {}, {
        iconLayout: 'default#image',
        iconImageHref: '../icons/placemark.svg',
        iconImageSize: [56, 64],
        iconImageOffset: [-14, -38],
    });

    map.controls.remove('geolocationControl');
    map.controls.remove('zoomControl');
    map.controls.remove('searchControl');
    map.controls.remove('trafficControl');
    map.controls.remove('typeSelector');
    map.controls.remove('fullscreenControl');
    map.controls.remove('rulerControl');
    map.behaviors.disable('leftMouseButtonMagnifier');

    map.geoObjects.add(placemarkShop);

    if(window.matchMedia('(min-width: 1296px)').matches && window.matchMedia('(max-width: 1735px)').matches) {
        map.setCenter([55.86202541500607,35.642278436622675], 7, {checkZoomRange: true});
    }
    if(window.matchMedia('(min-width: 696px)').matches && window.matchMedia('(max-width: 1295px)').matches) {
        map.setCenter([55.8558464435142,37.63080382724769], 7, {checkZoomRange: true});
    }
    if(window.matchMedia('(min-width: 0px)').matches && window.matchMedia('(max-width: 695px)').matches) {
        map.setCenter([55.8558464435142,37.63080382724769], 7, {checkZoomRange: true});
    }
}

ymaps.ready(init);


/* location-balloon */
const balloonButtons = document.querySelectorAll('.map-balloon__content-icon');
const balloonTexts = document.querySelectorAll('.map-balloon__content-span_copy');

balloonButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(balloonTexts[index].textContent.replace(/^\s+/gm, ''))
        .then(() => {
            console.log('Text copied');
        })
        .catch(err => {
            console.error('Error in copying text: ', err);
        });
    });
});


/* requisites-table */
const copyButtons = document.querySelectorAll('.table__row-secondary-icon');
const copiedTexts = document.querySelectorAll('.table__row-secondary-text');

copyButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(copiedTexts[index].textContent.replace(/^\s+/gm, ''))
        .then(() => {
            console.log('Text copied');
        })
        .catch(err => {
            console.error('Error in copying text: ', err);
        });
    });
});


/* banner-slider */
const sliderBox = document.querySelector('.banner-slider__box'),
    sliderBoxWidth = document.querySelector('.banner-slider__box').clientWidth,
    buttonPrevious = document.querySelector('.banner-slider__buttons-btn-container_left'),
    iconPrevious = document.querySelector('.banner-slider__buttons-btn_left'),
    buttonNext = document.querySelector('.banner-slider__buttons-btn-container_right'),
    iconNext = document.querySelector('.banner-slider__buttons-btn_right'),
    imageOffset = document.querySelector('.banner-slider__box-image').clientWidth,
    indicateLine = document.querySelector('.banner-slider__indicator'),
    indicatorOffset = document.querySelector('.banner-slider__indicator').clientWidth,
    indicateLineOffset = document.querySelector('.banner-slider__indicator-line').clientWidth;

const gaps = {
    desktop: 4,
    laptop: 2.4,
    tablet: 4,
    phone: 0,
}

const resolutions = {
    desktop: window.matchMedia('(min-width: 1736px)').matches,
    laptop: window.matchMedia('(max-width: 1735px)').matches && window.matchMedia('(min-width: 1296px)').matches,
    tablet: window.matchMedia('(max-width: 1295px)').matches && window.matchMedia('(min-width: 696px)').matches,
    phone: window.matchMedia('(max-width: 695px)').matches,
}

let sliderOffset = 0;
let lineOffset = 0
let gap = 0
let maxOffset = 0;
let maxLineOffset = 0;

const nextSlide = () => {
    if(resolutions.desktop) {
        gap = gaps.desktop;
    } else if(resolutions.laptop) {
        gap = gaps.laptop;
    } else if(resolutions.tablet) {
        gap = gaps.tablet;
    } else {
        gap = gaps.phone;
    }
    buttonPrevious.style.borderColor = '#00A55A';
    iconPrevious.style.backgroundColor = '#00A55A';
    const sumOffset = -imageOffset / 10 - gap;
    sliderOffset += sumOffset;
    lineOffset += indicatorOffset / 10;
    if((sliderOffset <= 3 * sumOffset) && (lineOffset >= (indicatorOffset / 10) * 3) ) {
        buttonNext.style.borderColor = '#FFFFFF';
        iconNext.style.backgroundColor = '#D9D9D9';
        sliderOffset = 3 * sumOffset;
        lineOffset = (indicatorOffset / 10) * 3;
    }
    sliderBox.style.left = sliderOffset + 'rem';
    indicateLine.style.left = lineOffset + 'rem';
}

const previousSlide = () => {
    if(resolutions.desktop) {
        gap = gaps.desktop;
    } else if(resolutions.laptop) {
        gap = gaps.laptop;
    } else if(resolutions.tablet) {
        gap = gaps.tablet;
    } else {
        gap = gaps.phone;
    }
    buttonNext.style.borderColor = '#00A55A';
    iconNext.style.backgroundColor = '#00A55A';
    const sumOffset = imageOffset / 10 + gap;
    sliderOffset += sumOffset;
    lineOffset -= indicatorOffset / 10;
    if((sliderOffset >= 0) && (lineOffset <= 0)) {
        buttonPrevious.style.borderColor = '#FFFFFF';
        iconPrevious.style.backgroundColor = '#D9D9D9';
        sliderOffset = 0;
        lineOffset = 0;
    }
    sliderBox.style.left = sliderOffset + 'rem';
    indicateLine.style.left = lineOffset + 'rem';
}

buttonNext.addEventListener('click', nextSlide);
buttonPrevious.addEventListener('click', previousSlide);

let x1 = 0;
let x2 = 0;
let deltaX = 0;

const touchStart = (event) => {
    x1 = event.touches[0].clientX;
}

const touchMove = (event) => {
    if(!x1) {
        return false;
    }
    x2 = event.touches[0].clientX;
    deltaX = x2 - x1;
    moveSlider(deltaX);
}

const moveSlider = (offset) => {
    if(resolutions.desktop) {
        maxOffset = (gaps.desktop + imageOffset / 10) * 3;
        maxLineOffset = indicateLineOffset / 10 - indicatorOffset /10;
        gap = gaps.desktop;
    } else if(resolutions.laptop) {
        maxOffset = (gaps.laptop + imageOffset / 10) * 3;
        maxLineOffset = indicateLineOffset / 10 - indicatorOffset /10; 
        gap = gaps.laptop;
    } else if(resolutions.tablet) {
        maxOffset = (imageOffset / 10 + gaps.tablet) * 5;
        maxLineOffset = sliderBoxWidth / 10 - indicatorOffset /10;
        gap = gaps.tablet;
    } else {
        maxOffset = imageOffset /10 *5;
        maxLineOffset = sliderBoxWidth / 10 - indicatorOffset /10;
        gap = gaps.phone;
    }
    sliderOffset += offset / 10;
    lineOffset -= (offset / 10 * ((indicatorOffset /10) / (imageOffset / 10 + gap)));
    if((sliderOffset >= 0) && (lineOffset <= 0)) {
        sliderOffset = 0;
        lineOffset = 0;
    } else if((sliderOffset <= -maxOffset) && (lineOffset >= maxLineOffset)) {
        sliderOffset = -maxOffset;
        lineOffset = maxLineOffset;
    }
    sliderBox.style.left = sliderOffset + 'rem';
    indicateLine.style.left = lineOffset + 'rem';
}

sliderBox.addEventListener('touchstart', touchStart, false);
sliderBox.addEventListener('touchmove', touchMove, false);


/* team-slider */
const teamSliderBox = document.querySelector('.team__slider-box'),
    teamSliderBoxWidth = document.querySelector('.team__slider-box').clientWidth,
    teamButtonPrevious = document.querySelector('.team__buttons-btn-container_left'),
    teamIconPrevious = document.querySelector('.team__buttons-btn_left'),
    teamButtonNext = document.querySelector('.team__buttons-btn-container_right'),
    teamIconNext = document.querySelector('.team__buttons-btn_right'),
    teamImageOffset = document.querySelector('.card-member__image').clientWidth,
    teamIndicateLine = document.querySelector('.team__indicator'),
    teamIndicatorOffset = document.querySelector('.team__indicator').clientWidth,
    teamIndicateLineOffset = document.querySelector('.team__indicator-line').clientWidth;

const teamGaps = {
    desktop: 4,
    laptop: 2.4,
    tablet: 2.4,
    phone: 0,
}

let teamSliderOffset = 0;
let teamLineOffset = 0
let teamGap = 0
let teamMaxOffset = 0;
let teamMaxLineOffset = 0;
let teamMultiplicity = 0;

const teamNextSlide = () => {
    if(resolutions.desktop) {
        teamGap = teamGaps.desktop;
        teamMultiplicity = 2;
    } else if(resolutions.laptop) {
        teamGap = teamGaps.laptop;
        teamMultiplicity = 3;
    } else if(resolutions.tablet) {
        teamGap = teamGaps.tablet;
    } else {
        teamGap = teamGaps.phone;
    }
    teamButtonPrevious.style.borderColor = '#00A55A';
    teamIconPrevious.style.backgroundColor = '#00A55A';
    const teamSumOffset = -teamImageOffset / 10 - teamGap;
    teamSliderOffset += teamSumOffset;
    if(teamSliderOffset <= teamMultiplicity * teamSumOffset) {
        teamButtonNext.style.borderColor = '#FFFFFF';
        teamIconNext.style.backgroundColor = '#D9D9D9';
        teamSliderOffset = teamMultiplicity * teamSumOffset;
    }
    teamSliderBox.style.left = teamSliderOffset + 'rem';
}

const teamPreviousSlide = () => {
    if(resolutions.desktop) {
        teamGap = teamGaps.desktop;
    } else if(resolutions.laptop) {
        teamGap = teamGaps.laptop;
    } else if(resolutions.tablet) {
        teamGap = teamGaps.tablet;
    } else {
        teamGap = teamGaps.phone;
    }
    teamButtonNext.style.borderColor = '#00A55A';
    teamIconNext.style.backgroundColor = '#00A55A';
    const teamSumOffset = teamImageOffset / 10 + teamGap;
    teamSliderOffset += teamSumOffset;
    if(teamSliderOffset >= 0) {
        teamButtonPrevious.style.borderColor = '#FFFFFF';
        teamIconPrevious.style.backgroundColor = '#D9D9D9';
        teamSliderOffset = 0;
    }
    teamSliderBox.style.left = teamSliderOffset + 'rem';
}

teamButtonNext.addEventListener('click', teamNextSlide);
teamButtonPrevious.addEventListener('click', teamPreviousSlide);

let teamX1 = 0;
let teamX2 = 0;
let teamDeltaX = 0;

const teamTouchStart = (event) => {
    teamX1 = event.touches[0].clientX;
}

const teamTouchMove = (event) => {
    if(!teamX1) {
        return false;
    }
    teamX2 = event.touches[0].clientX;
    teamDeltaX = teamX2 - teamX1;
    teamMoveSlider(teamDeltaX);
}

const teamMoveSlider = (offset) => {
    if(resolutions.desktop) {
        teamMaxOffset = (teamGaps.desktop + teamImageOffset / 10) * 2;
        teamGap = teamGaps.desktop;
    } else if(resolutions.laptop) {
        teamMaxOffset = (teamGaps.laptop + teamImageOffset / 10) * 3;
        teamGap = teamGaps.laptop;
    } else if(resolutions.tablet) {
        teamMaxOffset = (teamImageOffset / 10 + teamGaps.tablet) * 1;
        teamMaxLineOffset = teamSliderBoxWidth / 10 - teamIndicatorOffset /10;
        teamGap = teamGaps.tablet;
    } else {
        teamMaxOffset = teamImageOffset /10 *5;
        teamMaxLineOffset = teamSliderBoxWidth / 10 - teamIndicatorOffset /10;
        teamGap = teamGaps.phone;
    }
    teamSliderOffset += offset / 10;
    teamLineOffset -= (offset / 10 * ((teamIndicatorOffset /10) / (teamImageOffset / 10 + teamGap)));
    if((teamSliderOffset >= 0) && (teamLineOffset <= 0)) {
        teamSliderOffset = 0;
        teamLineOffset = 0;
    } else if((teamSliderOffset <= -teamMaxOffset) && (teamLineOffset >= teamMaxLineOffset)) {
        teamSliderOffset = -teamMaxOffset;
        teamLineOffset = teamMaxLineOffset;
    }
    teamSliderBox.style.left = teamSliderOffset + 'rem';
    teamIndicateLine.style.left = teamLineOffset + 'rem';
}

teamSliderBox.addEventListener('touchstart', teamTouchStart, false);
teamSliderBox.addEventListener('touchmove', teamTouchMove, false);