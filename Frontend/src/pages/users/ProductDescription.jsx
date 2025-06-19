import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { server_url, getCookie } from "../../utils/script";
import { toast } from "react-toastify";

const ProductDescription = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      try {
        const { data, status } = await axios.get(
          `${server_url}/user/getProductById/${productId}`
        );

        if (status === 200 && data) {
          const productData = data.data || data;
          
          if (productData?._id) {
            setProduct({
              ...productData,
              imageUrl: `${server_url}${productData.photo}`,
              discountedPrice: calculateDiscount(
                productData.price,
                productData.discount
              ),
              originalPrice: productData.price,
            });
          } else {
            setError("Product data is invalid");
          }
        } else {
          setError(data?.message || "Product not found");
        }
      } catch (err) {
        handleFetchError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const calculateDiscount = (price, discount) => {
    return Math.round(price * (1 - discount / 100));
  };

  const handleFetchError = (err) => {
    let errorMessage = "Error loading product";
    
    if (err.response) {
      errorMessage = err.response.data?.message || "Server error";
    } else if (err.request) {
      errorMessage = "Network error - no response from server";
    }

    setError(errorMessage);
    console.error("Product fetch error:", err);
  };

  const handleAddToCart = async () => {
    const token = getCookie("userToken");

    if (!token) {
      toast.warn("Please login to add items to cart");
      return;
    }

    try {
      const { data } = await axios.post(
        `${server_url}/user/addToCart/${product._id}`,
        {
          oldPrice: product.originalPrice,
          newPrice: product.discountedPrice,
          discount: product.discount,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.error) {
        toast.warn(data.message);
        if (data.redirect) window.location.href = data.redirect;
      } else {
        toast.success(data.message);
      }
    } catch (err) {
      toast.error("Error adding product to cart");
      console.error("Cart error:", err);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row g-4">
        {/* Product Image Section */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="img-fluid w-100"
              style={{ maxHeight: "500px", objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Product Details Section */}
        <div className="col-lg-6">
          <div className="card border-0 p-4 h-100">
            <h1 className="h2 fw-bold text-success">{product.name}</h1>
            
            <p className="mt-3 text-muted lead">{product.description}</p>
            
            <div className="mt-4">
              <div className="d-flex align-items-center mb-2">
                <h3 className="text-success mb-0 me-3">
                  ₹{product.discountedPrice}
                </h3>
                {product.discount > 0 && (
                  <span className="badge bg-success bg-opacity-10 text-success">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
              
              {product.discount > 0 && (
                <p className="text-muted text-decoration-line-through mb-4">
                  ₹{product.originalPrice}
                </p>
              )}
            </div>

            <button
              className="btn btn-success btn-lg w-100 py-3 mt-3"
              onClick={handleAddToCart}
            >
              <i className="bi bi-cart-plus me-2"></i>
              Add to Cart
            </button>

            {/* Eco-friendly badge */}
            <div className="mt-4 p-3 bg-light rounded-2 border-start border-4 border-success">
              <div className="d-flex align-items-center">
                <i className="bi bi-tree-fill text-success fs-4 me-2"></i>
                <div>
                  <h6 className="mb-0 text-success">Eco-Friendly Product</h6>
                  <small className="text-muted">
                    This product meets our sustainability standards
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;