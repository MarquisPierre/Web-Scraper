"use client";  // Indicates that this component is client-side only in a Next.js application

import "react-responsive-carousel/lib/styles/carousel.min.css"; // Imports the CSS for the carousel
import { Carousel } from 'react-responsive-carousel'; // Imports the Carousel component from the library
import Image from "next/image"; // Imports the Image component from Next.js for optimized image handling

const HeroCarousel = () => {
    // Array of objects representing the hero images for the carousel
    const heroImages = [
        { imgUrl: '/assets/images/hero-1.svg', alt: 'smartwatch' },
        { imgUrl: '/assets/images/hero-2.svg', alt: 'bag' },
        { imgUrl: '/assets/images/hero-3.svg', alt: 'lamp' },
        { imgUrl: '/assets/images/hero-4.svg', alt: 'air fryer' },
        { imgUrl: '/assets/images/hero-5.svg', alt: 'chair' },
    ];

    return (
        <div className="hero-carousel">
            {/* Carousel configuration */}
            <Carousel
                showThumbs={false}  // Disables thumbnail navigation
                autoPlay  // Enables automatic slide transition
                // infiniteLoop  // Allows carousel to loop infinitely
                // interval={2000}  // Sets slide interval to 2 seconds
                showArrows={false}  // Hides navigation arrows
                showStatus={false}  // Hides slide status indicator
            >
                {/* Maps over heroImages array to create carousel slides */}
                {heroImages.map((image) => (
                    <Image
                        src={image.imgUrl}  
                        alt={image.alt}  
                        width={484} 
                        height={484}  
                        key={image.alt}  
                    />
                ))}
            </Carousel>
            
            {/* Additional decorative image of an arrow */}
            <Image
                src="assets/icons/hand-drawn-arrow.svg"  
                alt="arrow"  
                width={175}  
                height={175}  
                className="max-xl:hidden absolute -left-[15%] bottom-0 z-0"  // CSS classes for positioning and hiding on smaller screens
            />
        </div>
    );
};

export default HeroCarousel;  
