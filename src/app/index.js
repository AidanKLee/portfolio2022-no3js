import $ from 'jquery';
import gazetteer from '../assets/images/gazetteer.png';
import directory from '../assets/images/directory.png';
import readit from '../assets/images/readit.png';
import icommerce from '../assets/images/icommerce.png';
import phoenix from '../assets/images/phoenix.png';
import faviconImg from '../assets/images/logo128.png';
import VanillaTilt from 'vanilla-tilt';
import '../assets/fontawesome-free-6.1.1-web/js/all.min';
import './three';
import './index.css';
import './fonts.css';

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



document.addEventListener('DOMContentLoaded', e => {
    
    // Project Images
    /************************************************/
    const favicon = document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    favicon.setAttribute('type', 'image/x-icon');
    favicon.setAttribute('href', faviconImg);
    document.querySelector('head').appendChild(favicon);


    // Project Images
    /************************************************/
    const directoryImg = createImage(directory, 'Company Directory', '#directory .img');
    const gazetteerImg = createImage(gazetteer, 'Gazetteer', '#gazetteer .img');
    const readitImg = createImage(readit, 'Readit4Reddit', '#readit .img');
    const icommerceImg = createImage(icommerce, 'iCommerce', '#icommerce .img');
    const phoenixImg = createImage(phoenix, 'Phoenix MMA', '#phoenix .img');

    VanillaTilt.init(document.querySelectorAll('#projects figure'), {
        reverse: true,
        max: 2
    });

    VanillaTilt.init(document.querySelectorAll('#about figure'), {
        reverse: true,
        max: 5,
        glare: true,
        "max-glare": .2
    });

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

    console.log(form)

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

})