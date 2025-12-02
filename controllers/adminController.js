const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getCollections } = require("../config/database");

// const createAdminSeeder = async (req, res) => {
//     try {
//         const { adminCollection } = getCollections();
//         const { email, password } = req.body;

//         // Check if admin already exists
//         const exist = await adminCollection.findOne({ email });
//         if (exist) {
//             return res.status(409).json({ message: "Admin already exists!" });
//         }

//         // Password Hash
//         const hashed = await bcrypt.hash(password, 10);

//         // Create admin
//         const newAdmin = await adminCollection.insertOne({
//             name: 'Super Admin',
//             email,
//             password: hashed,
//             role: "admin",
//             createdAt: new Date()
//         });

//         res.status(201).json({
//             message: "Admin created successfully!",
//             data: newAdmin
//         });

//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// ======================= ADMIN LOGIN ===========================
const adminLogin = async (req, res) => {
    try {
        const { adminCollection } = getCollections();
        const { email, password } = req.body;

        const admin = await adminCollection.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const match = await bcrypt.compare(password, admin.password);
        if (!match) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign(
            { id: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login success",
            token,
            admin: {
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = { createAdminSeeder, adminLogin };
