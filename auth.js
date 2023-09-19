const log = require('./model/usermodel');

// Middleware to check authentication
const isAuthenticated = async (req, res, next) => {
    try {
        // Check if the 'session' cookie is present
        if (!req.cookies.session) {
            return res.status(401).send('Unauthorized');
        }

        const userId = req.cookies.session;

        // Retrieve the user from MongoDB using the userId from the cookie
        const user = await log.findById(userId);

        if (!user) {
            return res.status(401).send('Unauthorized');
        }

        // Attach the user object to the request for future middleware/routes
        req.user = user;

        next(); // User is authenticated, proceed to the next middleware/route
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = isAuthenticated;
