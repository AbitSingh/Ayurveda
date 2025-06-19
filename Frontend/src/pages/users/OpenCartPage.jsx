import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Form, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import {server_url, getCookie} from "../../utils/script.jsx";
import { useNavigate } from 'react-router-dom';
import {toast} from "react-toastify";

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    email: '',
    mobile: '',
    paymentMode: 'cod',
  });

  useEffect(() => {
    loadCartProducts();
    fetchCities();
  }, []);

  const loadCartProducts = async () => {
    const token = getCookie('userToken');
    try {
      const res = await axios.get(`${server_url}/user/getUserCartProducts`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { data, userEmail } = res.data;
      setCartItems(data);
      setFormData((prev) => ({ ...prev, email: userEmail }));

      const total = data.reduce((acc, item) => acc + item.newPrice * item.quantity, 0);
      setTotalPrice(Math.round(total));
    } catch (error) {
      console.log(error.message);
      //alert('Error loading cart products');
    }
  };

  const fetchCities = async () => {
    const token = getCookie('userToken');
    try {
      const res = await axios.get(`${server_url}/user/getCities`,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.data.error) {
        console.log('Cities fetched successfully');
        console.log(res.data.data);
        setCities(res.data.data);
      } else {
        toast.error('Error loading cities');
      }
    } catch (error) {
      toast.error('Failed to fetch cities.');
    }
  };

  const incrementQuantity = async (id) => {
    const token = getCookie('userToken');
    try {
      // increment mai 3rd argument config hoti hai, so wahi pai headers pass karna hai, so beech mai {} yeah laga.
      const res = await axios.post(`${server_url}/user/incrementProductQuantity/${id}`,{},
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.data.error) {
        loadCartProducts();
      } else {
        toast.warn(res.data.message);
      }
    } catch (error) {
      toast.error('Error incrementing quantity');
    }
  };

  const decrementQuantity = async (id) => {
    const token = getCookie('userToken');
    try {
      // decrement mai 3rd argument config hoti hai, so wahi pai headers pass karna hai, so beech mai {} yeah laga.
      const res = await axios.post(`${server_url}/user/decrementProductQuantity/${id}`,{},
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.data.error) {
        loadCartProducts();
      } else {
        toast.warn(res.data.message);
      }
    } catch (error) {
      toast.error('Error decrementing quantity');
    }
  };

  const removeProduct = async (id) => {
    const token = getCookie('userToken');
    try {
      // remove mai 2nd argument config hoti hai, so wahi pai headers pass karna hai, so beech mai {} yeah nahi laga.
      const res = await axios.delete(`${server_url}/user/removeProductFromCart/${id}`,
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.data.error) {
        loadCartProducts();
      } else {
        toast.warn(res.data.message);
      }
    } catch (error) {
      toast.error('Error removing product');
    }
  };




    const sendEmailOnSuccess = async (email, orderId) => {
    try {
      console.log('Sending email to:', email);
      console.log('Order ID:', orderId);
      await axios.post(`${server_url}/user/send-success-email`, {
        email,
        orderId,
      }, {
        headers: {
          Authorization: `Bearer ${getCookie('userToken')}`
        }
      });
      toast.success('✅ Email sent successfully.');
      console.log('✅ Email sent successfully.');
    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
    }
  };


  const placeOrder = async () => {
    const { address, city, email, mobile, paymentMode } = formData;

    if (!address || !city || !email || !mobile) {
      toast.warn('Please fill all the fields');
      return;
    }

    if (paymentMode === 'online') {
      const options = {
        key: 'rzp_test_dRWiKHS7zr2Gki',
        amount: totalPrice * 100,
        currency: 'INR',
        name: 'AayuSetu',
        description: 'AayuSetu Transaction',
        image: '/images/Logo-2.jpg',
        handler: async function (response) {
          toast.success(`✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`);

          try {
            const res = await axios.post(`${server_url}/user/placeOrder`, {
              grandTotal: totalPrice,
              address,
              city,
              email,
              mobile,
              paymentMode,
            },{
              headers: {
                Authorization: `Bearer ${getCookie('userToken')}`
              }
            });
            console.log("Placed Order Data", res);
            if (!res.data.error) {
              console.log("Placed Order Data", res.data)
              toast.success(`✅ ${res.data.message}`);

              await sendEmailOnSuccess(email, res.data.records._id); // Add this line

              loadCartProducts();
              setFormData({
                address: '',
                city: '',
                email: '',
                mobile: '',
                paymentMode: 'cod',
              });
              navigate('/user/thankYou');
              //window.location.href = 'user/thankyoupage';
            }
          } catch (error) {
            toast.error('Error placing order');
          }
        },
        prefill: {
          name: address,
          email: email,
          contact: mobile,
        },
        theme: {
          color: '#3399cc',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      try {
        const res = await axios.post(`${server_url}/user/placeOrder`, {
          grandTotal: totalPrice,
          address,
          city,
          email,
          mobile,
          paymentMode,
        },{
          headers: {
            Authorization: `Bearer ${getCookie('userToken')}`
          }
        });

        console.log("Placed Order Data", res);
        if (!res.data.error) {
          toast.success(`✅ ${res.data.message}`);

          await sendEmailOnSuccess(email, res.data.records._id); // Add this line
          navigate('/user/thankYou');
          //window.location.href = 'user/thankyoupage';
          loadCartProducts();
          setFormData({
            address: '',
            city: '',
            email: '',
            mobile: '',
            paymentMode: 'cod',
          });
        }
      } catch (error) {
        toast.error('Error placing order');
      }
    }
  };

  return (


    <Container className="mt-5">
      <h3 className="mb-4">Your Cart</h3>

      {(!cartItems || cartItems.length === 0) ? (
    <p>No items found.</p>
  ) : (
    <Table borderless>
      <thead>
        <tr>
          <th><h5>Product</h5></th>
          <th><h5>Product Name</h5></th>
          <th><h5>Price(₹)</h5></th>
          <th><h5>Update</h5></th>
          <th><h5>Remove</h5></th>
        </tr>
      </thead>
      <tbody>
        {cartItems.map((x) => (
          <tr key={x._id}>
            <td>
              <img src={`${server_url}${x.productId.photo}`} alt="product" style={{ height: '70px', width: '70px' }} />
            </td>
            <td>{x.productId.name}</td>
            <td>₹{x.newPrice}</td>
            <td>
              <Button variant="success" onClick={() => decrementQuantity(x._id)}>-</Button>{' '}
              <span className="mx-2">{x.quantity}</span>
              <Button variant="success" onClick={() => incrementQuantity(x._id)}>+</Button>
            </td>
            <td>
              <Button variant="danger" onClick={() => removeProduct(x._id)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )}

      <div className="mt-4">
        <h4>Billing Summary</h4>
        <p className="text-success fw-bold">Item total (MRP): ₹{totalPrice}</p>
      </div>

      <div className="mt-4">
        <Form>
          <Form.Group controlId="addressInput" className="mb-3">
            <Form.Label>Enter Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your delivery address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </Form.Group>

          <Form.Group controlId="city" className="mb-3">
            <Form.Label>Select City</Form.Label>
            <Form.Control
              as="select"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            >
              <option value="">Select City</option>
              {cities.map((city, index) => (
                <option key={index} value={city.name}>{city.name}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Enter Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="mobile" className="mb-3">
            <Form.Label>Enter Mobile Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Payment Mode</Form.Label>
            <div>
              <Form.Check
                inline
                label="Cash On Delivery"
                name="paymentMode"
                type="radio"
                id="cod"
                value="cod"
                checked={formData.paymentMode === 'cod'}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
              />
              <Form.Check
                inline
                label="Online"
                name="paymentMode"
                type="radio"
                id="online"
                value="online"
                checked={formData.paymentMode === 'online'}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
              />
            </div>
          </Form.Group>

          <Button variant="success" className="w-100 my-4" onClick={placeOrder}>
            Pay Now
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default CartPage;
