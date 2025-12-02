const { ObjectId } = require("mongodb");
const { getCollections } = require("../config/database")

const createCourse = async (req, res) => {
    const { coursesCollection } = getCollections();
    try {
        const {
            imageUrl,
            title,
            description,
            category,
            instructor,
            price,
            batchName,
            startDate,
            endDate,
            maxStudents,
            priceRange
        } = req.body;

        if (!title || !instructor || !price || !batchName || !startDate || !priceRange) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const courseDoc = {
            imageUrl,
            title,
            description,
            category,
            instructor,
            price: Number(price),
            priceRange,
            batches: [
                {
                    name: batchName,
                    startDate: new Date(startDate),
                    endDate: endDate ? new Date(endDate) : null,
                    maxStudents: maxStudents ? Number(maxStudents) : null
                }
            ],
            createdAt: new Date()
        };

        const result = await coursesCollection.insertOne(courseDoc);

        res.status(201).json({
            message: "Course created successfully",
            data: result,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


const getCourses = async (req, res) => {
    const { coursesCollection } = getCollections();

    try {
        const {
            search,
            category,
            priceSort,
            page = 1,
            limit = 10
        } = req.query;

        let query = {};

        // title or instructor
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { instructor: { $regex: search, $options: "i" } }
            ];
        }

        // multiple categories
        if (category) {
            const categoryArr = category.split(",");
            query.category = { $in: categoryArr };
        }

        // SORT by price range (High/Low)
        let sortOption = {};
        if (priceSort === "low") {
            sortOption.price = 1;
        }
        if (priceSort === "high") {
            sortOption.price = -1;
        }

        // Pagination
        const skip = (page - 1) * limit;

        // Fetch data
        const courses = await coursesCollection
            .find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        // Count total for frontend pagination
        const total = await coursesCollection.countDocuments(query);

        res.send({
            success: true,
            total,
            page: Number(page),
            limit: Number(limit),
            data: courses,
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Get single course
const getCourse = async (req, res) => {
    const { coursesCollection } = getCollections();
    try {
        const { id } = req.params;
        const query = { _id: new ObjectId(id) }
        const result = await coursesCollection.findOne(query);
        res.status(200).json({
            message: "Course get success",
            data: result
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

// UPDATE COURSE
const updateCourse = async (req, res) => {
    const { coursesCollection } = getCollections();

    try {
        const courseId = req.params.id;
        const updateCourseInfo = req.body;

        // Check existing course
        const existCourse = await coursesCollection.findOne({ _id: new ObjectId(courseId) });
        if (!existCourse) {
            return res.status(404).json({ message: "Course not found!" });
        }

        const result = await coursesCollection.updateOne(
            { _id: new ObjectId(courseId) },
            { $set: updateCourseInfo }
        );

        res.status(200).json({
            message: "Course updated successfully!",
            data: result
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete course
const deleteCourse = async (req, res) => {
    const { coursesCollection } = getCollections();

    try {
        const courseId = req.params.id;
        // Check existing course
        const existCourse = await coursesCollection.findOne({ _id: new ObjectId(courseId) });
        if (!existCourse) {
            return res.status(404).json({ message: "Course not found!" });
        }

        const result = await coursesCollection.deleteOne(
            { _id: new ObjectId(courseId) }
        );

        res.status(200).json({
            message: "Course updated successfully!",
            data: result
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createCourse, getCourses, getCourse, updateCourse, deleteCourse }