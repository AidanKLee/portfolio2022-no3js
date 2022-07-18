import $ from 'jquery';
import { loadingManager } from './three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gazetteer from '../assets/images/gazetteer.png';
import directory from '../assets/images/directory.png';
import readit from '../assets/images/readit.png';
import icommerce from '../assets/images/icommerce.png';
import phoenix from '../assets/images/phoenix.png';
import faviconImg from '../assets/images/logo128.png';
import solar from '../assets/audio/solar_penumbra.mp3'
import VanillaTilt from 'vanilla-tilt';
import '../assets/fontawesome-free-6.1.1-web/js/all.min';
import './three';
// import './index.css';
// import './fonts.css';

gsap.registerPlugin(ScrollTrigger);

const isTouchDevice = () => navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

const createImage = (src, alt, parentSelector) => {
    const parent = document.querySelector(parentSelector);
    const img = document.createElement('img');

    img.setAttribute('src', src);
    img.setAttribute('alt', alt);

    if (parentSelector && parent) {
        parent.append(img);
    }

    return img;
}

// Loading Progress
let loaded = false;
let animationDone = false;

const beginningGSAP = () => {
    document.querySelector('#loader').classList.add('done');

    const intro = gsap.timeline();
    intro.fromTo('#hero .left-intro', { autoAlpha: 0, x: '-100%', y: '-20%' }, { autoAlpha: 1, x: 0, y: 0, duration: .5 });
    intro.fromTo('#hero .right-intro', { autoAlpha: 0, x: '100%', y: '-20%' }, { autoAlpha: 1, x: 0, y: 0, duration: .5 });
    intro.fromTo('header', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 });

    setTimeout(() => document.querySelector('html').classList.add('loaded'),1000);
}

setTimeout(() => {
    if (loaded) {
        document.querySelector('#loader').classList.add('done');
        beginningGSAP();
    }

    animationDone = true;
}, 4000);

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = 100 * (itemsLoaded / itemsTotal);
    document.querySelector('#loader>div>div').style.backgroundSize = `${progress}% 100%`;
}

document.addEventListener('DOMContentLoaded', e => {

    loadingManager.onLoad = e => {
        if (animationDone) {
            beginningGSAP();
        }

        loaded = true;
    }
    
    // Project Images
    /************************************************/
    const head = document.querySelector('head');
    const favicon = document.createElement('link');
    const appleTouchIcon = document.createElement('link');

    favicon.setAttribute('rel', 'icon');
    favicon.setAttribute('href', faviconImg);

    appleTouchIcon.setAttribute('rel', 'apple-touch-icon');
    appleTouchIcon.setAttribute('href', faviconImg);

    head.appendChild(favicon);


    // Project Images
    /************************************************/
    const directoryImg = createImage(directory, 'Company Directory', '#directory .img');
    const gazetteerImg = createImage(gazetteer, 'Gazetteer', '#gazetteer .img');
    const readitImg = createImage(readit, 'Readit4Reddit', '#readit .img');
    const icommerceImg = createImage(icommerce, 'iCommerce', '#icommerce .img');
    const phoenixImg = createImage(phoenix, 'Phoenix MMA', '#phoenix .img');

    // Tooltips
    /************************************************/
    const tooltips = document.querySelectorAll('[data-tooltip]');

    tooltips.forEach(tooltip => {
        const name = tooltip.getAttribute('data-tooltip');
        const element = document.createElement('div');
        element.innerHTML = name;

        tooltip.appendChild(element);

        tooltip.addEventListener('mouseenter', e => {
            tooltip.timeout = setTimeout(() => {
                tooltip.classList.add('show');
            },400)
        })

        tooltip.addEventListener('mouseleave', e => {
            clearTimeout(tooltip.timeout);
            tooltip.classList.remove('show');
        })
    })

    // Vanilla Tilt
    /************************************************/
    const projectCards = document.querySelectorAll('#projects figure');
    const aboutCards = document.querySelectorAll('#about figure');

    const initVanillaTilt = () => {
        VanillaTilt.init(projectCards, {
            reverse: true,
            max: 2
        });
    
        VanillaTilt.init(aboutCards, {
            reverse: true,
            max: 5,
            glare: true,
            "max-glare": .2
        });
    }

    const destroyVanillaTilt = () => {
        projectCards.forEach(card => card.vanillaTilt.destroy());
        aboutCards.forEach(card => card.vanillaTilt.destroy());
    }
    
    if (!isTouchDevice()) {
        initVanillaTilt();
    }

    window.addEventListener('resize', e => {
        if (isTouchDevice() && projectCards[0].vanillaTilt) {
            destroyVanillaTilt();
            console.log('destroying vanilla tilt')
        } else if (!isTouchDevice() && !projectCards[0].vanillaTilt) {
            console.log('initialising vanilla tilt')
            initVanillaTilt();
        }
    })

    // Music Player
    /************************************************/
    let updateProgress;
    const playerContainer = document.getElementById('player');
    const player = new Audio(solar);
    const play = document.querySelector('#player button');
    const bar = document.querySelector('#player .progress');
    const progressTime = document.querySelector('#player .duration');

    const playIcon = '<i class="fa-solid fa-play"></i>';
    const pauseIcon = '<i class="fa-solid fa-pause"></i>';

    const switchIcon = icon => {
        play.innerHTML = icon;
    }

    const toMinSec = time => {
        time = Math.floor(time);
        const minutes = Math.floor(time / 60).toString();
        let seconds = Math.floor(time % 60).toString();

        if (seconds.length === 1) {
            seconds = `0${seconds}`;
        }
        time = `${minutes}:${seconds}`;
        return time;
    }

    const progress = () => {
        const trackDuration = player.duration;
        const time = player.currentTime;
        const progressPercent = (time / trackDuration) * 100;

        progressTime.innerHTML = `${toMinSec(time)} / ${toMinSec(trackDuration)}`;
        bar.style.backgroundSize = `${progressPercent}% 100%`;

        updateProgress = requestAnimationFrame(progress);

        if (player.ended) {
            player.pause();
            cancelAnimationFrame(updateProgress);
            switchIcon(playIcon);
        }
    }

    play.addEventListener('click', e => {
        if (player.paused) {
            player.play();
            progress();
            switchIcon(pauseIcon);
        } else {
            player.pause();
            cancelAnimationFrame(updateProgress);
            switchIcon(playIcon);
        }
    })

    bar.addEventListener('click', e => {
        const trackDuration = player.duration;
        const position = e.layerX;
        const total = e.target.clientWidth;
        const positionPercent = (position / total) * 100;
        const positionTime = (positionPercent / 100) * trackDuration;

        player.currentTime = positionTime;

        if (player.paused) {
            bar.style.backgroundSize = `${positionPercent}% 100%`;
            progressTime.innerHTML = `${toMinSec(positionTime)} / ${toMinSec(trackDuration)}`;
        }
    })

    bar.addEventListener('mousemove', e => {
        const element = e.target.firstChild;
        const position = e.layerX;
        const total = e.target.clientWidth;
        const positionPercent = (position / total) * 100;

        element.style.width = `${positionPercent}%`;
    })

    bar.addEventListener('mouseleave', e => {
        const element = e.target.firstChild;
        element.style.width = '0';
    })

    playerContainer.appendChild(player);

    // Collapse Element
    /************************************************/
    const collapseElement = document.querySelector('.collapse');
    const collapseButton = document.querySelector('.collapse-toggle button');

    collapseButton.addEventListener('click', e => {
        const open = collapseElement.getAttribute('collapse-open') === 'true';

        if (open) {
            collapseElement.style.height = collapseElement.scrollHeight + 'px';
            
            setTimeout(() => {
                collapseElement.style.height = 0;
                collapseButton.previousElementSibling.textContent = 'View More';
                collapseButton.classList.remove('open');
            }, 100)
        } else {
            collapseElement.style.height = collapseElement.scrollHeight + 'px';
            collapseButton.previousElementSibling.textContent = 'View Less';
            collapseButton.classList.add('open');

            setTimeout(() => {
                collapseElement.style.height = 'fit-content';
            },400)
        }
        collapseElement.setAttribute('collapse-open', !open);
    })

    // Typed Element Effect
    /************************************************/
    const sentences = [
        { text: 'Full Stack Developer', color: 'orange' },
        { text: 'Composer', color: 'orange' },
        { text: 'Music Producer', color: 'orange' },
        { text: 'Barista', color: 'orange' },
        { text: 'Photographer', color: 'orange' },
        { text: 'Gym Instructor', color: 'orange' }
    ];

    const typeSentence = async (sentence, eleRef, delay = 70) => {
        const letters = sentence.split("");
        let i = 0;
        while(i < letters.length) {
          await waitForMs(delay + (Math.random() * 100));
          $(eleRef).append(letters[i]);
          i++
        }
        return;
    }

    const deleteSentence = async eleRef => {
        const sentence = $(eleRef).html();
        const letters = sentence.split("");
        let i = 0;
        while(letters.length > 0) {
          await waitForMs(100);
          letters.pop();
          $(eleRef).html(letters.join(""));
        }
    }
      
    const waitForMs = ms => {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    const updateFontColor = (eleRef, color) => {
        $(eleRef).css('color', color);
    }
      
    const carousel = async (carouselList, eleRef) => {
        var i = 0;
        while(true) {
            updateFontColor(eleRef, carouselList[i].color)
            await typeSentence(carouselList[i].text, eleRef);
            await waitForMs(1500);
            await deleteSentence(eleRef);
            await waitForMs(500);
            i++
            if(i >= carouselList.length) {i = 0;}
        }
    }

    carousel(sentences, '.sentence');

    // Menu Nav Toggle
    /************************************************/
    const menuToggler = document.querySelector('.nav-toggler');
    const menuClose = document.querySelector('.menu-close');
    const menu = document.querySelector('.menu-backdrop');

    menuToggler.addEventListener('click', e => {
        menu.classList.add('open');
    })

    menuClose.addEventListener('click', e => {
        menu.classList.remove('open');
    })

    window.addEventListener('resize', e => {
        if (window.innerWidth > 720 && menu.classList.contains('open'))  {
            menu.classList.remove('open');
        }
    })

    // Contact Form
    /************************************************/

    const form = document.querySelector('form#message');
    const submitButton = document.querySelector('button#submit');

    form.addEventListener('submit', e => {
        e.preventDefault();
        
        let data = {};
        const formData = new FormData(e.target);

        for (let pair of formData) {
            data[pair[0]] = pair[1];
        }

        for (let i=0; i<6; i++) {
            form[i].disabled = true;
        }

        submitButton.classList.add('submitting');

        $.ajax({
            url: 'http://localhost/portfolio/contact.php',
            dataType: 'json', type: 'POST',
            data,
            success: res => {
                for (let i=0; i<6; i++) {
                    form[i].disabled = false;
                    form[i].value = '';
                }

                submitButton.classList.remove('submitting');
            },
            error: (jqXHR, textStatus, err) => {
                for (let i=0; i<6; i++) {
                    form[i].disabled = false;
                }

                submitButton.classList.remove('submitting');

                console.error({ jqXHR, textStatus, err });
            }
        })
    })

    // Scroll Animations
    /************************************************/
    
    gsap.to('#hero', {
        scrollTrigger: {
            trigger: '#about',
            pin: '#hero',
            pinSpacing: false,
            start: 'top calc(99% - 1px)',
            end: 'top 85%',
            scrub: 1
        },
        autoAlpha: 0,
        scale: 2,
        display: 'none',
        yPercent: -10
    })
    
    gsap.to('#hero .actions', {
        scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'top center',
            scrub: 2
        },
        autoAlpha: 0,
        scale: 4,
        yPercent: 100
    })
    
    gsap.to('#about .head', {
        scrollTrigger: {
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        yPercent: 150
    })

    gsap.from('#about .head', {
        scrollTrigger: {
            trigger: '#about .head',
            start: 'bottom bottom',
            end: 'top 70%',
            scrub: 2
        },
        autoAlpha: 0,
        x: '-128px',
    })
    
    gsap.to('#about .scrolling-banner', {
        scrollTrigger: {
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        },
        yPercent: -300
    })
    
    gsap.to('#about .typed', {
        scrollTrigger: {
            trigger: '#about .typed',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        yPercent: -100
    })

    const ratings = document.querySelectorAll('.rating');
    ratings.forEach(rating => {
        gsap.to(rating, {
            scrollTrigger: {
                trigger: rating,
                start: 'top 90%',
                toggleClass: 'active'
            }
        })
    })

    gsap.from('.qual-head', {
        scrollTrigger: {
            trigger: '.qual-head',
            start: 'top bottom',
            end: 'top 70%',
            scrub: 2
        },
        autoAlpha: 0,
        y: '256px'
    })

    const qualifications = document.querySelectorAll('#qualifications figure');
    qualifications.forEach(qualification => {
        gsap.from(qualification, {
            scrollTrigger: {
                trigger: qualification,
                start: 'top bottom',
                end: 'top center',
                toggleClass: 'active',
                scrub: 2,
            },
            y: '256px'
        })
    })

    const projectsHeader = gsap.timeline({
        scrollTrigger: {
            trigger: '#projects h2',
            start: 'bottom 90%',
            end: 'bottom 70%',
            scrub: 4
        },
    });

    projectsHeader.from('#projects h2', {
        scaleX: 0,
        duration: 1
    })

    projectsHeader.from('#projects h2 div', {
        autoAlpha: 0,
        x: '-128px',
        duration: 1
    })

    const projects = document.querySelectorAll('#projects figure');

    projects.forEach(project => {
        gsap.from(project, {
            scrollTrigger: {
                trigger: project,
                start: 'top bottom',
                end: 'top center',
                scrub: 2
            },
            autoAlpha: 0,
            y: '192px'
        })
    })
})