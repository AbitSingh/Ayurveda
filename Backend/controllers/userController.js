var userController = {};
const { or } = require('sequelize');
const db = require('../db.config');
const userModel = db.user;
var subCategoryModel = db.subcategory;
var productModel = db.product;
var orderDetailsModel = db.orderDetails;
var orderModel = db.orders;
var citiesModel = db.cities;
var appointmentModel = db.appointments;
var contactModel = db.contacts;

// Adding Security.
var jwt = require('jsonwebtoken');
var secret_key = 'abcd@#$%1234567890';

userController.loginUser = async (req, res) => {
    try {
        console.log("Req body is", req.body);
        const { loginEmail, loginPassword } = req.body;

        if (!loginEmail || !loginPassword) {
            return res.json({ error: true, message: 'All fields are required' });
        } else {
            // Mongoose version: using findOne with MongoDB filter
            var user = await userModel.findOne({ email: loginEmail });

            if (!user) {
                return res.json({ error: true, message: 'User not found' });
            } else {
                if (user.password !== loginPassword) {
                    return res.json({ error: true, message: 'Incorrect password' });
                } else {
                    console.log("User data from MongoDB is: ", user);

                    var payload = {
                        id: user._id,               // MongoDB uses _id
                        email: user.email,
                        name: user.name
                    };
                    var token = jwt.sign(payload, secret_key, { expiresIn: '1d' });
                    console.log(token);
                    return res.json({ error: false, message: 'Login successful', token: token });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ error: true, message: error.message });
    }
};

userController.registerUser = async (req, res) =>{
    try{
        console.log(req.body);
        const {name, email, password, confirmPassword} = req.body;
        if(!name || !email || !password || !confirmPassword){
            return res.json({error: true, message: 'All fields are required'});
        }
        else if(password !== confirmPassword){
            return res.json({error: true, message: 'Passwords do not match'});
        }
        else{
            const data = await userModel.create({name, email, password});
            res.json({error: false, message: 'User registered successfully', data: data});
        }
        
    } catch(error){
        console.log(error);
        res.json({error: true, message: error.message});
    }
}

userController.logoutUser = async (req,res) =>{
    try{
        res.clearCookie('userToken');
        res.json({error: false, message: 'Logout Successful'});
    }catch(error){
        console.log(error);
        res.json({error: true, message: error.message});
    }
}



userController.getSubCategoryProducts = async (req, res) => {
  try {
    console.log("We have reached the getSubCategoryProducts Controller");
    const subCategoryName = req.params.name;
    console.log("subCategoryName is:", subCategoryName);

    // Find the subcategory by name
    const subCategory = await subCategoryModel.findOne({ name: subCategoryName });

    if (!subCategory) {
      return res.status(404).json({ error: true, message: 'Subcategory not found' });
    }

    const subCategoryExtractedId = subCategory._id;

    // Find all products with this subcategoryId
    const products = await productModel.find({ subcategoryId: subCategoryExtractedId });

    if (!products || products.length === 0) {
      return res.status(404).json({ error: true, message: 'Products not found' });
    }

    console.log("Products data is:", products);

    // ✅ Send JSON data to frontend
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: error.message });
  }
};




userController.showAllProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        const subcategories = await subCategoryModel.find();

        // res.render('user/userShowAllProducts', {
        //     products: products,
        //     subcategories: subcategories
        // });
        res.json({error: false, subcategories:subcategories, products: products })
    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).send("Server Error");
    }
};

// Show products by subcategory
userController.showProductsBySubcategory = async (req, res) => {
    const subcategoryId = req.params.id;
    try {
        const subcategories = await subCategoryModel.find();
        const products = await productModel.find({ subcategoryId: subcategoryId });

        // res.render('user/userShowAllProducts', {
        //     subcategories: subcategories,
        //     products: products
        // });
        res.json({error: false, subcategories:subcategories, products: products})

    } catch (error) {
        console.error("Error fetching products by subcategory:", error);
        res.status(500).send("Server Error");
    }
};

userController.addToCart = async (req, res) => {
    try {
        var productId = req.params.id;
        console.log("ProductId is: ", productId);

        var token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.json({ error: true, message: 'Token expired. Please Login Again.', redirect: "/" });
        }

        console.log("Token is: ", token);
        console.log("Secret key is: ", secret_key);

        var decode = jwt.verify(token, secret_key);
        console.log("Decoded token is: ", decode);

        var userId = decode.id;
        console.log("UserId is: ", userId);

        var { oldPrice, newPrice, discount } = req.body;

        // Mongoose equivalent of findOne with multiple fields
        var data = await orderDetailsModel.findOne({
            productId: productId,
            userId: userId,
            status: 'cart'
        });

        console.log("Data from add to cart: ", data);

        if (data) {
            // Update quantity using $inc in Mongoose
            var updateData = await orderDetailsModel.updateOne(
                {
                    productId: productId,
                    userId: userId,
                    status: 'cart'
                },
                {
                    $inc: { quantity: 1 }
                }
            );
            res.json({ error: false, message: 'Product quantity updated successfully' });
        } else {
            // Create new cart item
            var addToCart = await orderDetailsModel.create({
                productId: productId,
                quantity: 1,
                userId: userId,
                oldPrice: oldPrice,
                newPrice: newPrice,
                status: 'cart',
                discount: discount
            });
            console.log("Add to cart data is: ", addToCart);
            res.json({ error: false, message: 'Product added to cart successfully' });
        }

    } catch (error) {
        console.log("Error verifying token:", error);
        return res.json({ error: true, message: 'Token expired. Please Login Again.', redirect: "/" });
    }
};


userController.openCartPage = async (req, res) =>{
    console.log("We have reached the openCartPage Controller ");
    res.render('user/openCartPage');
}

userController.getUserCartProducts = async (req, res) => {
    try {
        // Extract token from Authorization header
        var token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.json({
                error: true,
                message: 'Token expired. Please Login Again.',
                redirect: "/"
            });
        }

        // Verify token
        var decode = jwt.verify(token, secret_key);
        var userId = decode.id;
        var userEmail = decode.email;
        console.log("UserId is: ", userId);

        // Fetch cart products with status 'cart' for the user
        var cartProducts = await orderDetailsModel.find({
            userId: userId,
            status: 'cart'
        }).populate({
            path: 'productId',
            select: 'id name photo price'
        });

        if (cartProducts && cartProducts.length > 0) {
            console.log("Cart products are: ", cartProducts);
            res.json({
                error: false,
                message: 'Cart products fetched successfully',
                data: cartProducts,
                userEmail: userEmail
            });
        } else {
            return res.json({
                error: true,
                message: 'No products in cart'
            });
        }

    } catch (error) {
        console.log("Error verifying token:", error);
        return res.json({
            error: true,
            message: 'Token expired. Please Login Again.',
            redirect: "/"
        });
    }
};
// userController.updateCartQuantity = async (req, res) =>{
//     try {
//         const { cartId, quantity } = req.body;
    
//         if (!cartId || quantity == null) {
//           return res.status(400).json({ error: true, message: "Cart ID and quantity are required." });
//         }
    
//         if (quantity < 1) {
//           return res.status(400).json({ error: true, message: "Quantity must be at least 1." });
//         }
    
//         const orderDetail = await orderDetailsModel.findById(cartId);
//         if (!orderDetail) {
//           return res.status(404).json({ error: true, message: "Order detail not found." });
//         }
    
//         orderDetail.quantity = quantity;
//         await orderDetail.save();
//         return res.status(200).json({ error: false, message: "Quantity updated successfully.", data: orderDetail });
//       } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: true, message: "Server error while updating quantity." });
//       }
// };

userController.decrementProductQuantity = async (req, res) => {
    var id = req.params.id;

    try {
        var cartItem = await orderDetailsModel.findById(id);

        if (!cartItem) {
            return res.json({ error: true, message: 'Product not found in cart' });
        }

        console.log("Cart item is: ", cartItem);

        const currentQuantity = parseInt(cartItem.quantity, 10);

        if (currentQuantity <= 1) {
            return res.json({ error: false, message: 'Minimum quantity reached' });
        }

        await orderDetailsModel.findByIdAndUpdate(id, {
            quantity: currentQuantity - 1
        });

        return res.json({ error: false, message: 'Product quantity updated successfully' });
    } catch (err) {
        console.error(err);
        return res.json({ error: true, message: 'Server error' });
    }
};


userController.incrementProductQuantity = async (req, res) => {
    var id = req.params.id;
    try {
        var cartItem = await orderDetailsModel.findById(id);

        if (!cartItem) {
            return res.status(400).json({ error: true, message: 'Product not found in cart' });
        }
        console.log("Cart item is: ", cartItem);
        const currentQuantity = parseInt(cartItem.quantity, 10);
        await orderDetailsModel.findByIdAndUpdate(id, {
            quantity: currentQuantity + 1
        });
        return res.json({ error: false, message: 'Product quantity updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: true, message: 'Server error' });
    }
};

userController.removeProductFromCart = async (req, res) => {
    try {
        var id = req.params.id;
        console.log("Id is: ", id);
        // In Mongoose, use findByIdAndDelete or deleteOne
        var deleteProduct = await orderDetailsModel.findByIdAndDelete(id);

        if (deleteProduct) {
            res.json({ error: false, message: 'Product removed from cart successfully' });
        } else {
            res.json({ error: true, message: 'Product not found in cart' });
        }
    } catch (error) {
        console.log(error);
        res.json({ error: true, message: error.message });
    }
};

userController.placeOrder = async (req, res) => {
    try {
        var token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.json({ error: true, message: 'Token expired. Please Login Again. ', redirect: "/" });
        }

        var decode = jwt.verify(token, secret_key);
        var userId = decode.id;

        var { address, city, email, mobile, grandTotal, paymentMode } = req.body;
        console.log("Req body is: ", req.body);

        let paymentStatus = '';
        if (paymentMode === 'cod') {
            paymentStatus = 'Cash On Delivery';
        } else if (paymentMode === 'online') {
            paymentStatus = 'Paid Online';
        }

        var placeOrderData = await orderModel.create({
            grand_total: grandTotal,
            payment_mode: paymentMode,
            order_status: 'pending',
            payment_status: paymentStatus,
            city: city,
            address: address,
            email: email,
            mobile: mobile,
            userId: userId
        });

        var orderId = placeOrderData._id; // Use _id in Mongoose
        console.log("Your Order ID is:", orderId);

        await orderDetailsModel.updateMany(
            { userId: userId, status: 'cart' },
            {
                $set: {
                    status: 'placed',
                    orderId: orderId
                }
            }
        );

        res.json({ error: false, message: 'Order placed successfully', records: placeOrderData });

    } catch (error) {
        console.log(error);
        res.json({ error: true, message: error.message });
    }
};

userController.getCities = async (req, res) => {
    try {
        const cities = await citiesModel.find();
        res.json({ error: false, data: cities });
    } catch (error) {
        console.error(error);
        res.json({ error: true, message: 'Failed to load cities' });
    }
};


userController.renderThankYouPage = async (req, res) =>{
    console.log("WE HAVE REACHED THE THANK YOU PAGE CONTROLLER ");
    res.render('user/thankyoupage');
}

userController.getUserOrders = async (req, res) =>{
    
    res.render('user/myOrders');

}

userController.getMyOrders = async (req, res) =>{
        
        try{
            //var token = req.cookies.userToken;
            var token = req.headers.authorization?.split(" ")[1];
            if(!token){
                return res.json({error: true, message: 'Token expired. Please Login Again. ', redirect: "/"});
            }

            var decode = jwt.verify(token, secret_key);
            //console.log("Decoded token is: ", decode);
            var userId = decode.id;       
            var userEmail = decode.email;
            console.log("UserId is: ", userId);
            var orders = await orderModel.find( {userId: userId});
            res.json({error: false, message: 'Orders fetched successfully', data: orders});
        } catch(error){
            console.log("Error verifying token:", error);
            return res.json({error: true, message: 'Token expired. Please Login Again. ', redirect: "/"});
        }
       
}

userController.bookAppointment = async(req, res) =>{
    try{
        console.log("WE have reached at book appointments page.");
        //var token = req.cookies.userToken;
        var token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.json({error: true, message: 'Token expired. Please Login Again. ', redirect: "/"});
        }

        var decode = jwt.verify(token, secret_key);
        //console.log("Decoded token is: ", decode);
        var userId = decode.id;       
        //var userEmail = decode.email;
        console.log("UserId is: ", userId);
        var {name, phone, message, subject, date} = req.body;
        var data = await appointmentModel.create({
            name: name, 
            phone: phone,
            message: message,
            subject: subject,
            date: date,
            userId: userId 
        })

        res.json({error: false, message: "Appointment is Booked! ✅ Our team member will call you."});

    }catch(error){
        res.json({error: true, message:  error.message});
    }
}


userController.verifyToken = (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if (token) {
        try {
            let userData = jwt.verify(token, secret_key); // Verify Token
            res.json({error: false, message: 'Authorized', userData: userData});
        } catch (error) {
            res.json({error: true, message: 'Unauthorized'});
        }
    } else
    {
        res.json({error: true, message: 'Unauthorized'});
    }
}


userController.sendSuccessEmail = async (req, res) => {
    const { email, orderId } = req.body;
    console.log("Email is: ", email);
    console.log("Abit Order Id is: ", orderId);

  try {
    // Example using nodemailer
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or your SMTP service
      auth: {
        user: 'team.ayurveda.care@gmail.com',
        pass: 'juznbomgkduvkqhq',
      },
    });

    const mailOptions = {
  from: '"Ayurveda Bliss" <team.ayurveda.care@gmail.com>',
  to: email,
  subject: `Your Order #${orderId} Confirmation`,
  html: `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
      <h2 style="color: #2d572c;">Thank you for your order!</h2>
      <p>Hi there,</p>
      <p>We’ve received your order <strong>#${orderId}</strong> and will notify you once it ships.</p>
      <p>Thank you for trusting Ayurveda Bliss.</p>
      <br>
      <p style="color: #888;">Team Ayurveda Bliss</p>
    </div>
  `,
};

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email send error:', error.message);
    res.status(500).json({ error: 'Failed to send email' });
  }

}


userController.contactUs = async (req, res) => {
    try{
        const { name, email, subject, message } = req.body;

        var data = await contactModel.create({
            name: name,
            email: email,
            subject: subject,
            message: message
        });

        res.status(200).json({ message: 'Form submitted successfully!' });
    } catch (error) {
        console.error('Contact form error:', error.message);
        res.status(500).json({ error: 'Something went wrong!' });
    }

}


userController.changePassword = async (req, res) => {
    console.log("We have reached the change password controller");
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ error: true, message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, secret_key);
    const email = decoded.email;
    console.log("Email is: ", email);

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ error: true, message: 'User not found' });
    }

    // Check current password
    if (user.password !== currentPassword) {
      return res.json({ error: true, message: 'Current password is incorrect' });
    }

    // Check if new passwords match
    // if (newPassword !== confirmPassword) {
    //   return res.status(400).json({ error: true, message: 'New and confirm password do not match' });
    // }

    // Update password
    var updateUser = await userModel.updateOne(
      { email: email },
      { $set: { password: newPassword } }
    );

    res.json({ error: false, message: 'Password changed successfully' });

  } catch (error) {
    console.log(error);
    res.json({ error: true, message: 'Something went wrong' });
  }
};

userController.getProductById = async (req, res) =>{
    try {
        const productId = req.params.id;
        console.log("Product ID is:", productId);
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: true, message: 'Product not found' });
        }else{
            console.log("Product data is:", product);
            res.json({error:false, message :'Product Found', data: product});
        }
    }
    catch(error){
        console.error("Error fetching product by ID:", error);
        res.status(500).json({ error: true, message: 'Server Error' });
    }   
}


userController.forgotPassword = async (req, res) =>{
    try{
        var {email} = req.body;
        console.log("Email is: ", email);

        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'team.ayurveda.care@gmail.com',
                pass: 'juznbomgkduvkqhq',
            }
        });

        const mailOptions = {
            from: ' "Ayurveda Bliss" <team.ayurveda.care@gmail.com>',
            to: email,
            subject: 'Password Reset Request',
            html: 
                `
                    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
                        <h2 style="color: #2d572c;">Password Reset Request</h2>
                        <p>Hi there,</p>
                        <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
                        <p>To reset your password, please click the link below:</p>
                        <p><a href="http://localhost:3000/user/enterNewPassword" style="color: #2d572c; text-decoration: none;"> <b> Reset Password </b></a></p>
                        <p>If you have any questions, feel free to contact us.</p>
                        <p>Thank you for trusting Ayurveda Bliss.</p>
                        <br>
                        <p style="color: #888;">Team Ayurveda Bliss</p>
                    </div>
                `
            };
                await transporter.sendMail(mailOptions);
                res.json({error: false, message: 'If this email exists, a password reset link has been sent.'})

    }catch(error){
        console.log("Error in forgot password controller: ", error);
        res.json({error: true, message: error.message});


    }
}

module.exports = userController;