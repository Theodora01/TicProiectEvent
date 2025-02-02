const admin = require("firebase-admin");

const authUser = async (req, res, next) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log("Auth Header:", authHeader);

    if (!token) {
        return res.status(401).json({ message: 'Token-ul lipsește. Acces interzis!' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
      } catch (error) {
        console.error("Eroare de autentificare:", error);
        return res.status(403).json({ message: "Token invalid sau expirat." });
    }
}

module.exports = authUser;