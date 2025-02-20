
import { Request, Response } from 'express';

import { getMyCellarWinesService } from '../services/myCellarService.js';

class MyCellarController {
async getMyCellarWines(req: Request, res: Response) {
    const { uid } = req.body;
    if (!uid ) {
      return res.status(422).json({
        uid: "UID is required"
      });
    }
      try {
        const wines = await getMyCellarWinesService(uid);
        res.status(200).json(wines);
      } catch (error) {
        console.error('[ERROR] getMyCellarWines. Unable to retrieve wines information. Error:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export default new MyCellarController();