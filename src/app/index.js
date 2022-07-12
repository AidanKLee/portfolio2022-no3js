import $ from 'jquery';
import readit from '../assets/images/readit.png';
import icommerce from '../assets/images/i-commerce.png';
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

const move = e => {
    console.log(e);
    const x = (e.offsetX - e.target.clientWidth) * -.2;
    const y = (e.offsetY - e.target.clientHeight) * -.2;

    const mouseLeave = e => {
        e.target.style.transform = '';
        e.target.removeEventListener('mouseleave', mouseLeave);
    }

    e.target.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.2)`;

    e.target.addEventListener('mouseleave', mouseLeave);
}

document.addEventListener('DOMContentLoaded', e => {
    const readitImg = createImage(readit, 'Readit4Reddit', '#readit .img');
    const icommerceImg = createImage(icommerce, 'iCommerce', '#icommerce .img');

    [readitImg, icommerceImg].forEach(img => {
        img.addEventListener('mousemove', move);
    })
})