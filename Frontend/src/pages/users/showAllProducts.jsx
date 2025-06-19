import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { server_url, getCookie } from "../../utils/script.jsx";
import {toast} from "react-toastify";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchAllProducts(); // Fetch all products and subcategories initially
  }, []);

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(`${server_url}/user/showAllProducts`);
      if (!res.data.error) {
        setProducts(res.data.products);
        setSubcategories(res.data.subcategories);
      }
    } catch (err) {
      console.error("Error fetching all products:", err);
    }
  };

  const fetchProductsBySubcategory = async (subcatId) => {
    try {
      const res = await axios.get(`${server_url}/user/products/${subcatId}`);
      if (!res.data.error) {
        setProducts(res.data.products); // Update products with filtered ones
      }
    } catch (err) {
      console.error("Error fetching products by subcategory:", err);
    }
  };

  const addToCart = async (productId, price, discountedPrice, discount) => {
    var token = getCookie("userToken");
    try {
      const res = await axios.post(`${server_url}/user/addToCart/${productId}`, {
        oldPrice: price,
        newPrice: discountedPrice,
        discount: discount
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.data.error) {
        toast.success(res.data.message);
      } else {
        toast.warn(res.data.message);
        if (res.data.redirect) window.location.href = res.data.redirect;
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Error adding product to cart.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Products</h2>
      <div className="row">
        {/* Sidebar - Subcategories */}
        <div className="col-md-3 mb-4">
          <h5 className="text-uppercase fw-bold">Categories</h5>
          <ul className="list-group">
            <li className="list-group-item">
              <button onClick={fetchAllProducts} className="btn btn-link p-0 text-start w-100">All Products</button>
            </li>
            {subcategories.map((sub) => (
              <li className="list-group-item" key={sub.id}>
                <button onClick={() => fetchProductsBySubcategory(sub._id)} className="btn btn-link p-0 text-start w-100">
                  {sub.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Products Grid */}

<div className="col-md-9">
  <div className="row">
    {products.length > 0 ? (
      products.map((product) => {
        console.log("Product is:", product);
        const discountedPrice = Math.round(product.price * (1 - product.discount / 100));
        return (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card h-100 d-flex flex-column">
              <Link
                to={`/user/products/${product._id}`}
                className="text-decoration-none text-dark flex-grow-1"
              >
                <img
                  src={`${server_url}${product.photo}`}
                  alt={product.name}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'contain' }}
                />
                <div className="card-body d-flex flex-column justify-content-between">
                  <h5 className="card-title" style={{ minHeight: "50px" }}>{product.name}</h5>
                  <div className="price-container d-flex align-items-center gap-2">
                    <span className="original-price text-danger text-decoration-line-through">
                      ₹{product.price}
                    </span>
                    <span className="discounted-price text-success fw-bold">
                      ₹{discountedPrice}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="p-2">
                <button
                  onClick={() =>
                    addToCart(product._id, product.price, discountedPrice, product.discount)
                  }
                  className="btn btn-success w-100 mt-auto"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <div className="col-12">
        <p>No products found.</p>
      </div>
    )}
  </div>
</div>



      </div>
    </div>
  );
};

export default AllProducts;
