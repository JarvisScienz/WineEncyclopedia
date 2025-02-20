import { Request, Response } from 'express';
import { getWineriesService, getWineriesListService, addWineriesService } from '../services/wineriesService.js';
  
class WineriesController {
async getWineries(_req: Request, res: Response) {
    try {
      
      const wineries = await getWineriesService();
  
        res.status(200).json(wineries);
      } catch (error) {
        console.error('[ERROR] getWienries. Unable to retrieve wineries informations.', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getWineriesList(_req: Request, res: Response) {
      try {
        const wineries = await getWineriesListService();
    
          res.status(200).json(wineries);
        } catch (error) {
          console.error('[ERROR] getWineriesList. Unable to retrieve the list name of wineries.', error);
          res.status(500).json({ error: "Internal Server Error" });
      }
    }

    async addWineries(req: Request, res: Response) {
      const wineries = req.body;

    if (!Array.isArray(wineries)) {
      return res.status(400).json({ error: "Request body must be an array of wines." });
    }
      try {
        const addedWineries = await addWineriesService(wineries);
    
          res.status(200).json(addedWineries);
        } catch (error) {
          console.error('[ERROR] addWineries. Unable to add wineries.', error);
          res.status(500).json({ error: "Internal Server Error" });
      }
    }
}

export default new WineriesController();