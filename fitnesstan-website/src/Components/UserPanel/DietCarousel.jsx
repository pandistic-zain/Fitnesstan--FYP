// src/components/DietCarousel.jsx
import React from "react";
import Carousel from "react-bootstrap/Carousel";

const DietCarousel = ({ dietItems }) => {
  return (
    <Carousel nextLabel="Down" prevLabel="Up" indicators={false} interval={3000}>
      {dietItems.map((item, index) => (
        <Carousel.Item key={index}>
          <div style={{ padding: "20px", textAlign: "center" }}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default DietCarousel;
