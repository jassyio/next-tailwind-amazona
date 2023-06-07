import React, { useState, useEffect } from 'react';

const ImageRow = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Replace this with the actual image URLs or file paths
  const imageList = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    'image4.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Preload images
    const preloadImages = imageList.map((image) => {
      const img = new Image();
      img.src = image;
      return img;
    });

    setImages(preloadImages);
  }, []);

  return (
    <tr>
      {images.map((image, index) => (
        <td key={index}>
          <img
            src={image.src}
            alt={`Image ${index + 1}`}
            style={{ maxWidth: '100%' }}
          />
        </td>
      ))}
    </tr>
  );
};

export default ImageRow;
