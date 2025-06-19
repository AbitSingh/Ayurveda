// Eska console.log(IDE kai browser pai ayega!)

var adminController = {}
//const { stripTypeScriptTypes } = require('module');
//const { log } = require('console');
var db = require('../db.config.js');
var adminModel = db.admin;
var categoryModel = db.category;
var subCategoryModel = db.subcategory;
var productModel = db.product;
var orderModel = db.orders;
var orderDetailsModel = db.orderDetails;
var userModel = db.user;
var appointmentModel = db.appointments;
const mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var secret_key = 'abcd@#$%1234567890';

adminController.renderAdminHomePage = (req, res) => {
    res.render('admin/adminManagePage');
}

adminController.renderAdminLoginPage = (req, res) => {
    res.render('admin/adminLoginPage');
}

adminController.testing = async (req, res) => {
    console.log('***')
    const data = await adminModel.find();
    res.json({data});
}

adminController.adminLoginPage = async (req, res) => {
    console.log("Req body is", req.body);
    const { loginEmail, loginPassword } = req.body;

    console.log("Login Email is: ", loginEmail);
    console.log("Login Password is: ", loginPassword);

    if (!loginEmail || !loginPassword) {
        return res.json({ error: true, message: 'All fields are required' });
    } else {
        try {
            const data = await adminModel.findOne({ email: loginEmail });
            console.log("Full Admin Data is: ", data);

            if (!data) {
                return res.json({ error: true, message: 'Admin not found' });
            } else if (data.password !== loginPassword) {
                return res.json({ error: true, message: 'Incorrect Admin Password' });
            } else {
                const payload = {
                    id: data._id,
                    name: data.name,
                    email: data.email
                };

                const token = jwt.sign(payload, secret_key, { expiresIn: '1d' });
                res.cookie('userToken', token);

                return res.json({ error: false, message: "Admin Login Successful", token: token, data: data });
            }
        } catch (error) {
            console.error("Error during admin login:", error);
            return res.status(500).json({ error: true, message: 'Internal Server Error' });
        }
    }
};

adminController.logoutAdminPage = (req, res) => {
    try {
        res.json({error: false, message: 'Admin Logout Successful'});
    } catch (error) {
        console.log(error.message);
        res.json({error: true, message: error.message});
    }
}

adminController.adminHomePage = (req, res) => {
    try {
        res.render('admin/adminHomePage');
    } catch (error) {
        console.log(error.message);
        res.json({error: true, message: error.message});
    }
}

adminController.renderManageAdminPage = (req, res) => {
    res.render('admin/adminManagePage');
}

adminController.addAdminForm = async (req, res) => {
    try {
        console.log(req.body);
        var {adminName, adminEmail, adminPassword, adminType} = req.body;

        if (!adminName || !adminEmail || !adminPassword) {
            return res.json({error: true, message: 'All fields are required'});
        } else if (adminPassword.length < 6) {
            return res.json({error: true, message: 'Password must be at least 6 characters long'});
        } else {
            var data = await adminModel.create({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                type: adminType
            });
            console.log("Data is: ", data);
            res.json({error: false, message: 'Admin added successfully', record: data});
        }
    } catch (error) {
        console.log(error.message);
        res.json({error: true, message: error.message});
    }
}

adminController.getAdminData = async (req, res) => {
    try {
        //Never reassign res, req, or next — they are core Express objects.
        // Use other variable names like adminData, data, result, etc.
        // var res = await adminModel.findAll(); --> WRONG! ERROR.
        var adminData = await adminModel.find();
        //console.log("Admin data from admin controller: ", adminData);
        res.json({error: false, message: 'Admin data fetched successfully', record: adminData});
    } catch (error) {
        console.log(error.message);
        res.json({error: true, message: error.message});
    }
}



adminController.deleteAdminData = async (req, res) => {
    try {
        console.log(req.params)
        var adminId = req.params.id;
        console.log("Admin ID from adminController: ", adminId);
        var data = await adminModel.findByIdAndDelete(adminId);

        console.log("Delete Admin Data is: ", data);
        res.json({error: false, message: 'Admin deleted successfully', record: data});

    } catch (error) {
        console.log(error.message);
        res.json({error: true, message: error.message});
    }
}

adminController.updateAdminData = async (req, res) => {
    try {
        // console.log("Req params are: " + req.params);  --> Error ayega kyoki req.params object hai aur string kai sath concatenate nahi kar sakte.
        console.log("Req params are: " + JSON.stringify(req.params));
        console.log("Req body is: ", req.body);
        var {id} = req.params;

        var result = await adminModel.findByIdAndUpdate(id, req.body);
        console.log("Result is: ", result);  // In Mongoose, this returns the document before update

        if (result) {
            res.json({error: false, message: "Admin updated successfully"});
        } else {
            res.json({error: true, message: "Admin not found"});
        }

    } catch (e) {
        console.error("Error updating admin:", e);
        res.json({message: e.message});
    }
}

adminController.addCategoryForm = async (req, res) => {
    try {
        var {name} = req.body;
        var {icon} = req.files;

        // Yeah vo vala path hai, jaha hamara icon store hoga.
        var db_path = `/uploads/${icon.name}`;

        // Yeah vo vala path hai, jaha sai hamara icon fetch hoga.
        var server_path = `public/uploads/${icon.name}`;
        console.log("db_path and server_path: ", db_path, server_path);

        // Moves (uploads) the icon file to the server folder
        icon.mv(server_path, (error) => {
            if (error) {
                console.log("Error in moving file: ", error);
                return res.json({error: true, message: error.message});
            }
        });

        // Hume upar req.body kai andar sai yeah nahi mila tha, toh ab hamne req.body kai andar icon daal diya hai taki database mai save ho sake.
        req.body.icon = db_path;
        await categoryModel.create(req.body);
        res.json({error: false, message: "Category added successfully"});

    } catch (error) {
        console.log(error.message);
        res.json({error: true, message: error.message});
    }

}

adminController.renderManageCategoryPage = (req, res) => {
    res.render('admin/category');
}

adminController.getCategoryData = async (req, res) => {
    try {
        const categories = await categoryModel.find({}, '_id name icon'); // Select _id instead of id
        const categoryData = categories.map(category => ({
            id: category._id.toString(), // Optional: convert ObjectId to string
            name: category.name,
            icon: category.icon
        }));
        res.json({ error: false, record: categoryData });
    } catch (error) {
        console.error(error);
        res.json({ error: true, message: "Failed to fetch categories" });
    }
};



adminController.deleteCategoryPage = async (req, res) => {
    try {
        console.log("Delete Request received.");
        var categoryId = req.params.id;
        console.log("Category ID from adminController: ", categoryId);

        // Mongoose syntax
        var data = await categoryModel.deleteOne({ _id: categoryId });

        res.json({ error: false, message: 'Category deleted Successfully', record: data });
    } catch (error) {
        console.log(error.message);
        res.json({ error: true, message: error.message });
    }
};


adminController.updateCategoryPage = async (req, res) => {
    try {
        console.log("Update Request received.");
        console.log("Req body is: ", req.body);

        var { id } = req.params;
        var { name } = req.body;

        console.log("Modal Updated Name is: ", name);

        var data = await categoryModel.findByIdAndUpdate(
            id,                    // Frontend sends this as "id", maps to _id in MongoDB
            req.body,              // The update object
            { new: true }          // Returns the updated document
        );
        console.log("Result is: ", data);
        res.json({ error: false, message: 'Category updated Successfully', record: data });
    } catch (error) {
        console.log(error.message);
        res.json({ error: true, message: error.message });
    }
};


adminController.renderSubCategoryPage = async (req, res) => {
    try {
        var data = await categoryModel.find();
        console.log("Data is: ", data);
        res.render('admin/subCategoryPage.ejs', {records: data});
    } catch (error) {
        console.log(error.message);
        res.json({error: true, message: error.message});
    }

}

adminController.addSubCategoryPage = async (req, res) => {
    try {
        //console.log("Subcategory data is: ", req.body);
        var { subCategory, categoryId } = req.body;

        // Ensure the categoryId is a valid ObjectId (optional but recommended)
        // const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.json({ error: true, message: 'Invalid categoryId format' });
        }

        var data = await subCategoryModel.create({
            name: subCategory,
            categoryId: categoryId  // categoryId is assumed to be an ObjectId
        });

        res.json({ error: false, message: 'Foreign key added successfully' });
    } catch (error) {
        console.log(error.message);
        res.json({ error: true, message: error.message });
    }
};


adminController.getSubCategoryData = async (req, res) => {
    try {
        var data = await subCategoryModel.find()
            .populate('categoryId', 'name'); // Populates categoryId field with only the category name

        //console.log("Subcategory data is: ", data);
        res.json({ error: false, message: 'Subcategory data fetched successfully', records: data });
    } catch (error) {
        console.log(error.message);
        res.json({ error: true, message: error.message });
    }
};

adminController.deleteSubCategoryPage = async (req, res) => {
    try {
        const subCategoryId = req.params.id;
        //console.log("SubCategory ID :", subCategoryId);

        if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
            return res.status(400).json({ error: true, message: 'Invalid SubCategory ID format' });
        }

        const result = await subCategoryModel.findByIdAndDelete(subCategoryId);

        if (!result) {
            return res.status(404).json({ error: true, message: 'Subcategory not found' });
        }

        res.json({ error: false, message: 'Subcategory deleted successfully', record: result });
    } catch (error) {
        console.error("Error while deleting subcategory:", error);
        res.status(500).json({ error: true, message: error.message });
    }
};

adminController.updateSubCategoryPage = async (req, res) => {
    try {
        var subCategoryId = req.params.id;
        //console.log(subCategoryId);
        var data = await subCategoryModel.findOneAndUpdate(
            { _id: subCategoryId },
            req.body,
            { new: true }
        );
        if (!data) {
            return res.json({ error: true, message: 'Subcategory not found' });
        }
        res.json({ error: false, message: 'Subcategory updated successfully', record: data });
    } catch (error) {
        console.log(error.message);
        res.json({ error: true, message: error.message });
    }
};


adminController.renderAdminProductPage = async (req, res) => {
    try {
        var data = await categoryModel.find();
        res.render('admin/adminProductPage', {records: data});
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Internal Server Error");
    }
};

//const subcategoryModel = require('../models/subcategory'); // adjust path as needed

adminController.getSubcategoriesByCategory = async (req, res) => {
    try {
        const categoryId = req.query.categoryId;
        if (!categoryId) {
            return res.json({ error: true, message: "Category ID is required" });
        }
        const subcategories = await subCategoryModel.find({ categoryId: categoryId });
        res.json({ error: false, record: subcategories });
    } catch (error) {
        console.error(error);
        res.json({ error: true, message: "Failed to fetch subcategories" });
    }
};


adminController.addProductPage = async (req, res) => {
    try {
        var {name, description, price, discount, categoryId, subcategoryId} = req.body;
        var {icon} = req.files;
        console.log(req.files);
        var db_path = `/uploads/${icon.name}`;
        var server_path = `public/uploads/${icon.name}`;
        console.log("db_path and server_path: ", db_path, server_path);

        await icon.mv(server_path, (error) => {
            if (error) {
                console.log("Error in moving file: ", error);
                return res.json({error: true, message: error.message});
            }
        });

        req.body.icon = db_path;

        console.log("Sub category id: ", subcategoryId);
        // Validate subcategoryId as ObjectId
        if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
            return res.json({ error: true, message: "Invalid subcategoryId" });
        }

        await productModel.create({
            name,
            description,
            price,
            discount,
            subcategoryId: new mongoose.Types.ObjectId(subcategoryId),
            photo: db_path
        });

        res.json({error: false, message: "Product added successfully"});

    } catch (error) {
        console.log(error.message);
        res.json({error: true, message: error.message});
    }
}


adminController.getProductData = async (req, res) => {
    try {
        //“Look at the subcategoryId field in the product document. It's an ObjectId referring to another collection
        // Go to that referenced collection (based on the ref value in the schema), fetch the document with that _id,
        // and include only the name field in the final result.”
        var data = await productModel.find()
            .limit(12)
            .populate({
                path: 'subcategoryId', // must match the field name in product schema
                select: 'name'         // selects only the `name` field from subCategory
            });
        console.log(data);
        res.json({ error: false, message: 'Product Data fetched Successfully', records: data });
    } catch (error) {
        console.log(error.message);
        res.json({ error: true, message: error.message });
    }
}


adminController.deleteProductData = async (req, res) => {
    try {
        var productId = req.params.id;
        var rec = await productModel.findByIdAndDelete(productId);
        // Agar rec null hai, toh product nahi mila
        if (!rec) {
            return res.json({ error: true, message: 'Product not found', record: null });
        }
        res.json({ error: false, message: 'Product deleted successfully', record: rec });
    } catch (error) {
        console.log(error.message);
        res.json({ error: true, message: error.message });
    }
}


adminController.updateProductData = async (req, res) => {
    try {
        var productId = req.params.id;
        var data = await productModel.findByIdAndUpdate(productId, req.body, { new: true });
        // If no product found
        if (!data) {
            return res.json({ error: true, message: 'Product not found', record: null });
        }
        console.log("Product Update response from admin controller: ", data);
        res.json({ error: false, message: 'Product updated successfully', record: data });
    } catch (error) {
        console.log(error.message);
        res.json({ error: true, message: error.message });
    }
}


adminController.getSubcategoriesDropdown = async (req, res) => {
    try {
        const categoryId = req.query.categoryId;
        if (!categoryId) {
            return res.status(400).json({ error: true, message: "Category ID is required" });
        }

        console.log("Category Id: ", categoryId);
        const subcategories = await subCategoryModel.find(
            { categoryId: categoryId },
            { _id: 1, name: 1 } // Only fetch `_id` and `name`
        );

        console.log(`Subcategories found for categoryId ${categoryId}:`, subcategories);
        const subcategoryNames = subcategories.map(sub => sub.name);

        res.json({ error: false, subcategories: subcategoryNames });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        res.status(500).json({ error: true, message: "Failed to fetch subcategories" });
    }
};


adminController.renderPendingOrdersPage = async (req, res) => {
    res.render('admin/managePendingOrders');
}

adminController.renderShippedOrdersPage = async (req, res) => {
    try {
        res.render('admin/manageShippedOrders');
    } catch (error) {
        console.log(error.message);
        res.json({error: true, message: error.message});
    }
}

adminController.renderDeliveredOrdersPage = async (req, res) => {
    try {
        res.render('admin/manageDeliveredOrders');
    } catch (error) {
        console.log(error.message);
        res.json({error: true, message: error.message});
    }
}

adminController.getPendingOrders = async (req, res) => {
    try {
        //console.log("Get Pending Orders Request received in Controllers.");
        var data = await orderModel.find({order_status: 'pending'});
        res.json({error: false, message: 'Pending Orders fetched successfully', records: data});
    } catch (error) {
        console.log(error.message);
        res.json({error: true, message: error.message});
    }
}

adminController.shipNowOrder = async (req, res) => {
    try {
        var id = req.params.id;
        // Update order status to 'shipped' by order ID
        var data = await orderModel.updateOne(
            { _id: id },
            { $set: { order_status: 'shipped' } }
        );
        res.json({ error: false, message: 'Order shipped successfully', record: data });
    } catch (error) {
        console.log(error.message);
        res.json({ error: true, message: error.message });
    }
};

adminController.getOrderDetails = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Order ID from adminController in getOrderDetails: ", id);

        const data = await orderDetailsModel.find({ orderId: id })
            .populate({
                path: 'productId', // Assuming the field in orderDetailsModel is 'productId' referencing productModel
                select: 'name photo' // Select only required fields
            });

        console.log("Order Details data from adminController: ", data);
        res.json({ error: false, message: 'Order details fetched successfully', data: data });
    } catch (error) {
        console.log(error.message);
        res.json({ error: true, message: error.message });
    }
};



adminController.getShippedOrders = async (req, res) => {

    try {
        //console.log("Get Pending Orders Request received in Controllers.");
        var data = await orderModel.find({order_status: 'shipped'});
        res.json({error: false, message: 'Pending Orders fetched successfully', records: data});
    } catch (error) {
        console.log(error.message);
        res.json({error: true, message: error.message});
    }
}

adminController.deliverNowOrder = async (req, res) => {
    try {
        var id = req.params.id;
        console.log("Order ID from deliver order: ", id);
        var data = await orderModel.findByIdAndUpdate(
            id,
            { $set: { order_status: 'Deliver' } },
            { new: true } // returns the updated document
        );
        res.json({ error: false, message: 'Order is out for Delivery', record: data });
    } catch (error) {
        console.log(error.message);
        res.json({ error: true, message: error.message });
    }
};


adminController.getDeliverOrders = async (req, res) => {
    try {
        //console.log("Get Pending Orders Request received in Controllers.");
        var data = await orderModel.find({order_status: 'Deliver'});
        res.json({error: false, message: 'Pending Orders fetched successfully', records: data});
    } catch (error) {
        console.log(error.message);
        res.json({error: true, message: error.message});
    }
}


adminController.renderAppointmentsPage = async (req, res) => {
    res.render('admin/seeAppointmentsAdmin');
}

adminController.seeAppointmentsData = async (req, res) => {
    try {
        var records = await appointmentModel.find();
        console.log("Appointments", records);
        res.json({error: false, message: "Appointments Fetched Successfully", records: records});
    } catch (error) {
        res.json({error: true, message: error.message});
    }
}

adminController.approveAppointment = async (req, res) => {
    try {
        var id = req.params.id;
        await appointmentModel.findByIdAndUpdate(id, { status: "Approved" });
        console.log("Approved JI");
        res.json({ error: false, message: 'Approved Successfully' });
    } catch (error) {
        res.json({ error: true, message: error.message });
    }
};


adminController.disApproveAppointment = async (req, res) => {
    try {
        var id = req.params.id;
        await appointmentModel.findByIdAndUpdate(id, { status: "Disapproved" });
        console.log("Approved JI");
        res.json({ error: false, message: 'Disapproved Successfully' });
    } catch (error) {
        res.json({ error: true, message: error.message });
    }
};

adminController.verifyToken = (req, res) => {
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

adminController.getCategories = async (req, res) => {
    try {
        // Mongoose does not use `attributes` or `order` like Sequelize
        const categories = await categoryModel.find({}, '_id name') // Select only _id and name
            .sort({ name: 1 }); // Sort by name ASC

        // Optional: map _id to id if frontend expects `id` instead of `_id`
        const mappedCategories = categories.map(cat => ({
            id: cat._id.toString(),
            name: cat.name
        }));

        res.json({
            records: mappedCategories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            error: 'Something went wrong while fetching categories.'
        });
    }
};


module.exports = adminController;