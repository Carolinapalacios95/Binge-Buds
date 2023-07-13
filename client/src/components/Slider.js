import Carousel from 'react-bootstrap/Carousel';
import React, { useState } from 'react';




//passing props
function Slider({ slides }) {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        console.log('selected index: ', selectedIndex)
        setIndex(selectedIndex);
    };
    return (
        <Carousel activeIndex={index} onSelect={handleSelect} interval={5000}>
  {slides.map((slide, idx) => (
    <Carousel.Item key={slide.image} interval={slide.interval}>
      <div className="carousel-item-wrapper">
        <img
          className="d-block mx-auto"
          src={slide.image}
          alt="slide"
        />
      </div>
      <Carousel.Caption>
        <h3>{slide.title}</h3>
        <p>{slide.subTitle}</p>
      </Carousel.Caption>
    </Carousel.Item>
  ))}
</Carousel>
            


        
    );
}

export default Slider;