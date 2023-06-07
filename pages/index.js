// import axios from 'axios';
// import { useContext } from 'react';
// import { toast } from 'react-toastify';
// import Layout from '../components/Layout';
// import ProductItem from '../components/ProductItem';
// import Product from '../models/Product';
// import db from '../utils/db';
// import { Store } from '../utils/Store';
// import data from '../utils/data';
// // import { Carousel } from 'react-responsive-carousel';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';
// import Link from 'next/link';
// import { useState } from 'react';
// import React, { useEffect } from 'react';



// export default function Home({ products, featuredProducts }) {
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const { state, dispatch } = useContext(Store);
//   const { cart } = state;
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);
//   const addToCartHandler = async (product) => {
//     const existItem = cart.cartItems.find((x) => x.slug === product.slug);
//     const quantity = existItem ? existItem.quantity + 1 : 1;
//     const { data } = await axios.get(`/api/products/${product._id}`);
//     const featuredProducts = data.products.slice(0, 4);
//     if (data.countInStock < quantity) {
//       return toast.error('Sorry. Product is out of stock');
//     }
//     dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });

//     toast.success('Product added to the cart');
//   };

//   return (
//     <Layout title="Home Page">
//     <table>
//       <tbody>
//         <tr>
//         {featuredProducts.map((product, index) => (
//   <td key={index}>
//     <Link href={`/product/${product.slug}`} passHref>
//       <img
//         src={product.image}
//         alt={product.name}
//         className={`w-full image-height ${
//           index === currentImageIndex ? 'opacity-100' : 'opacity-0'
//         }`}
//       />
//               </Link>
//             </td>
//           ))}
//         </tr>
//       </tbody>
//     </table>

//       <h2 className="h2 my-4">Latest Products</h2>
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
//         {products.map((product, index) => (
//   <ProductItem
//   product={product}
//   key={product.slug}
//   addToCartHandler={addToCartHandler}
//   index={index}
//   currentImageIndex={currentImageIndex}
//   setCurrentImageIndex={setCurrentImageIndex}
// ></ProductItem>
//         ))}
//       </div>
//     </Layout>
//   );
// }

// export async function getServerSideProps() {
//   await db.connect();
//   const products = await Product.find().lean();
//   const featuredProducts = await Product.find({ isFeatured: true }).lean();
//   return {
//     props: {
//       featuredProducts: featuredProducts.map(db.convertDocToObj),
//       products: products.map(db.convertDocToObj),
//     },
//   };
// }


import axios from 'axios';
import { useContext } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import Product from '../models/Product';
import db from '../utils/db';
import { Store } from '../utils/Store';
import data from '../utils/data';
import Link from 'next/link';
import { useState } from 'react';
import React, { useEffect } from 'react';
import { shuffle } from 'lodash';
export default function Home({ products, featuredProducts }) {
  const shuffledProducts = shuffle(products);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    const featuredProducts = data.products.slice(0, 4);
    if (data.countInStock < quantity) {
      return toast.error('Sorry. Product is out of stock');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Product added to the cart');
  };

  return (
    <Layout title="Home Page">
     <div className="flex justify-center mb-8">
        <div className="carousel-container max-w-screen-lg overflow-hidden">
          {shuffledProducts.map((product, index) => (
            <div
              key={index}
              className={`carousel-item flex-shrink-0 ${
                index === currentImageIndex ? 'active' : ''
              }`}
            >
              <Link href={`/product/${product.slug}`} passHref>
                <img
                  src={product.image}
                  alt={product.name}
                  className="carousel-image w-full rounded-lg object-cover"
                />
              </Link>
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
  const featuredProducts = await Product.find({ isFeatured: true }).lean();
  return {
    props: {
      featuredProducts: featuredProducts.map(db.convertDocToObj),
      products: products.map(db.convertDocToObj),
    },
  };
}





