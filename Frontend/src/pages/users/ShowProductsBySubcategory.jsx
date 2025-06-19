import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { server_url, getCookie } from '../../utils/script.jsx';
import {toast} from 'react-toastify';

const ProductListing = () => {
  const { subcategory } = useParams(); // get subcategory from URL
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(`${server_url}/user/subcategory/${subcategory}`)
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, [subcategory]);

  const addToCart = async (productId, price, discountedPrice, discount) => {
    const token = getCookie('userToken');
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
        toast.error(res.data.message);
        window.location.href = res.data.redirect;
      }
    } catch (err) {
      alert("Something went wrong while adding to cart.");
      console.error(err);
    }
  };

  return (
    <div className="bg-light" style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: "#f8f9fa" }}>
      <Container className="py-4">
        <h2>Products in {subcategory}</h2>
        <Row>
          {products.length > 0 ? (
            products.map((product) => {
              const discountedPrice = product.price - (product.price * product.discount / 100);
              return (
                <Col md={3} className="mb-4" key={product._id}>
                  <Card className="shadow-hover" style={{ height: '320px', borderRadius: '10px' }}>
                    <Card.Img
                      variant="top"
                      src={`${server_url}/${product.photo}`}
                      alt={product.name}
                      className="product-image"
                      style={{
                        paddingTop: '5px',
                        height: '150px',
                        objectFit: 'contain'
                      }}
                    />
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title
                          className="product-title"
                          style={{
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            minHeight: '40px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {product.name}
                        </Card.Title>
                        <div className="mb-2">
                          <span
                            className="original-price"
                            style={{
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: 'red',
                              textDecoration: 'line-through',
                              marginRight: '5px'
                            }}
                          >
                            ₹{product.price}
                          </span>
                          <span
                            className="discounted-price"
                            style={{
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: 'green'
                            }}
                          >
                            ₹{discountedPrice}
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        className="w-100"
                        variant="success"
                        onClick={() =>
                          addToCart(product._id, product.price, discountedPrice, product.discount)
                        }
                      >
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <p>No products found in this subcategory.</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default ProductListing;
