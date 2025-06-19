var express = require('express');
var router = express.Router();

// Admin Security:
var jwt = require('jsonwebtoken');
var secret_key = 'abcd@#$%1234567890';


function AuthorizeAdmin(req, res, next) {
    // console.log(req.cookies.UserToken);
    const token = req.headers.authorization.split(" ")[1]

    if (!token) //agar token nahi hai toh seedha login page pe lae jao
    {
        res.json({error: true, message: 'Login Required'});
    } else {
        try //token manually change hua hai yaa nahi verify krna hai
        {
            req.user = jwt.verify(token, secret_key); //data nikalo payload wala
            next();
        } catch (e) {
            res.json({error: true, message: 'Unauthorized Access'});
        }
    }
}

var adminController = require('../controllers/adminController');

router.get('/test', adminController.testing);
router.get('/', adminController.renderAdminLoginPage);

router.get('/adminHome', AuthorizeAdmin, adminController.renderAdminHomePage);

router.post('/login', adminController.adminLoginPage);

router.get('/logout', adminController.logoutAdminPage);

router.get('/home', AuthorizeAdmin, adminController.adminHomePage);

router.get('/manageAdmin', AuthorizeAdmin, adminController.renderManageAdminPage);

router.post('/addAdmin', AuthorizeAdmin, adminController.addAdminForm);

router.get('/readAdminData', adminController.getAdminData);

router.delete('/deleteAdmin/:id', AuthorizeAdmin, adminController.deleteAdminData);

router.put('/updateAdmin/:id', AuthorizeAdmin, adminController.updateAdminData);

router.get('/manageCategory', AuthorizeAdmin, adminController.renderManageCategoryPage);

router.post('/addCategory', AuthorizeAdmin, adminController.addCategoryForm);

router.get('/getCategory', adminController.getCategoryData);

router.delete('/deleteCategory/:id', AuthorizeAdmin, adminController.deleteCategoryPage);

router.put('/updateCategory/:id', AuthorizeAdmin, adminController.updateCategoryPage);

router.get('/manageSubCategory', AuthorizeAdmin, adminController.renderSubCategoryPage);

router.post('/addSubCategory', AuthorizeAdmin, adminController.addSubCategoryPage);

router.get('/getSubCategoryData', adminController.getSubCategoryData);

router.delete('/deleteSubCategory/:id', AuthorizeAdmin, adminController.deleteSubCategoryPage);

router.put('/updateSubCategory/:id', AuthorizeAdmin, adminController.updateSubCategoryPage);

router.get('/manageProduct', AuthorizeAdmin, adminController.renderAdminProductPage);

router.get('/getSubcategories', adminController.getSubcategoriesByCategory);

router.post('/addProduct', AuthorizeAdmin, adminController.addProductPage);

router.get('/getProducts', adminController.getProductData);

router.delete('/deleteProduct/:id', AuthorizeAdmin, adminController.deleteProductData);

router.put('/updateProduct/:id', AuthorizeAdmin, adminController.updateProductData);

router.get('/getSubcategoriesDropdown', adminController.getSubcategoriesDropdown);

router.get('/managePendingOrders', adminController.renderPendingOrdersPage); 

router.get('/manageShippedOrders', adminController.renderShippedOrdersPage);

router.get('/manageDeliveredOrders', adminController.renderDeliveredOrdersPage);

router.get('/getPendingOrders', adminController.getPendingOrders);

router.put('/shipNowOrder/:id', adminController.shipNowOrder);

router.get('/getOrderDetails/:id', adminController.getOrderDetails);

router.get('/getShippedOrders', adminController.getShippedOrders);

router.put('/deliverOrder/:id', adminController.deliverNowOrder);

router.get('/getDeliverOrders', adminController.getDeliverOrders);

router.get('/seeAppointments', adminController.renderAppointmentsPage);

router.get('/seeAppointmentsData', adminController.seeAppointmentsData);

router.put('/approveAppointment/:id', adminController.approveAppointment);

router.put('/disApproveAppointment/:id', adminController.disApproveAppointment);

router.get('/verify-token', adminController.verifyToken);

router.get('/getCategories', adminController.getCategories);

module.exports = router;