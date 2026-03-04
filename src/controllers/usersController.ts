import { Request, Response } from 'express';
import { getUserInformationService, saveReviewService, removeReviewService, updateUserInformationService, changePasswordService } from '../services/usersService.js';
  
class UsersController {
async getUserInformation(req: Request, res: Response) {
    try {
      const uid = req.body.uid;
      const user = await getUserInformationService(uid);
  
        res.status(200).json(user);
      } catch (error) {
        console.error('[ERROR] getWienries. Unable to retrieve wineries informations.', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateUserInformation(req: Request, res: Response) {
    try {
      const { uid, name, email } = req.body;
      await updateUserInformationService(uid, name, email);
      res.status(200).json({ message: "User information updated successfully." });
    } catch (error) {
      console.error('[ERROR] updateUserInformation.', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { uid, oldPassword, newPassword } = req.body;
      await changePasswordService(uid, oldPassword, newPassword);
      res.status(200).json({ message: "Password updated successfully." });
    } catch (error: any) {
      console.error('[ERROR] changePassword.', error);
      const code: string = error?.code || '';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        res.status(422).json({ error: "Wrong password." });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  async saveReview(req: Request, res: Response) {
    try {
      const uid = req.body.uid;
      const wineryID = req.body.wineryID;
      const review = req.body.review;

      await saveReviewService(uid, wineryID, review);
      res.status(200).json({ message: "Review saved successfully." });
    } catch (error) {
      console.error('[ERROR] saveReview. Unable to save review.', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
  async removeReview(req: Request, res: Response) {
    try {
      const { uid, wineryID } = req.body;
      await removeReviewService(uid, wineryID);
      res.status(200).json({ message: "Review removed successfully." });
    } catch (error) {
      console.error('[ERROR] removeReview. Unable to remove review.', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new UsersController();