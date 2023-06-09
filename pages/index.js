import axios from 'axios';
import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import { useState } from 'react';
import { shuffle } from 'lodash';

export default function Home({ products }) {
  const shuffledProducts = shuffle(products);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % shuffledProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [shuffledProducts.length]);

  const imagesToShow = [
    shuffledProducts[currentImageIndex],
    shuffledProducts[(currentImageIndex + 1) % shuffledProducts.length],
    shuffledProducts[(currentImageIndex + 2) % shuffledProducts.length],
    shuffledProducts[(currentImageIndex + 3) % shuffledProducts.length],
  ];

  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data: productData } = await axios.get(`/api/products/${product._id}`);
    if (productData.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home Page">
      <h2>Featured products</h2>
      <div className="flex justify-center mb-8">
        <div className="carousel-container overflow-hidden">
          {imagesToShow.map((product, index) => (
            <div key={index} className="carousel-item flex-shrink-0 active">
              <img
                src={product.image}
                alt={product.name}
                className="carousel-image w-full rounded-sm object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <h2 className="h2 my-4">Latest Products</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductItem
            product={product}
            key={product.slug}
            addToCartHandler={addToCartHandler}
            index={index}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
          ></ProductItem>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
