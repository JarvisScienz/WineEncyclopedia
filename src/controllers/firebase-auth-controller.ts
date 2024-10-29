import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  sendPasswordResetEmail
}  from 'firebase/auth';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


import app from '../config/firebase.js';

dotenv.config();
const secretKey = process.env.SECRET_KEY as string;

const auth = getAuth(app.app);

class FirebaseAuthController {
  registerUser(req: any, res: any) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        email: "Email is required",
        password: "Password is required",
      });
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        sendEmailVerification(auth.currentUser!)
          .then(() => {
            res.status(201).json({ message: "Verification email sent! User created successfully!" });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: "Error sending email verification" });
          });
      })
      .catch((error) => {
        const errorMessage = error.message || "An error occurred while registering user";
        res.status(500).json({ error: errorMessage });
      });
  }

  loginUser(req: any, res: any) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        email: "Email is required",
        password: "Password is required",
      });
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const idToken = userCredential.user.getIdToken();
        var userAndToken: any = {};
        var token = jwt.sign({ data: JSON.stringify(userCredential) }, secretKey, { expiresIn: 60 * 60 });
	    	userAndToken.userData = userCredential;
	    	userAndToken.tokenJWT = token;
        if (idToken) {
          res.cookie('access_token', idToken, {
            httpOnly: true
          });
          res.status(200).json(userAndToken);
        } else {
          res.status(500).json({ error: "Internal Server Error" });
        }
      })
      .catch((error) => {
        console.error(error);
        const errorMessage = error.message || "An error occurred while logging in";
        res.status(500).json({ error: errorMessage });
      });
  }

  logoutUser(req: any, res: any) {
    signOut(auth)
      .then(() => {
        res.clearCookie('access_token');
        res.status(200).json({ message: "User logged out successfully" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  }

  resetPassword(req: any, res: any) {
    const { email } = req.body;
    if (!email) {
      return res.status(422).json({
        email: "Email is required"
      });
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        res.status(200).json({ message: "Password reset email sent successfully!" });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      });
  }
}

export default new FirebaseAuthController();
