import { Request, Response } from 'express';
import { getUserInformationService, saveReviewService } from '../services/usersService.js';
  
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
}

export default new UsersController();