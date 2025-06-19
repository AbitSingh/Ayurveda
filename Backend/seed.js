// seed.js
const db = require('./Backend/db.config'); // Adjust path if needed
const Admin = db.admin;

const newAdmin = new Admin({
    name: 'Test Admin',
    email: 'admin@example.com',
    password: '123456',
    type: 'super'
});

newAdmin.save()
    .then(() => {
        console.log('Admin inserted successfully');
        process.exit();
    })
    .catch((err) => {
        console.error('Error inserting admin:', err);
        process.exit(1);
    });
