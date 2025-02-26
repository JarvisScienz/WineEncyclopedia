import { 
  getAuth
}  from 'firebase/auth';

import dotenv from 'dotenv';

//import firebaseWinesService from '../services/firebaseWinesService.js';
import app from '../config/firebase.js';
import { Request, Response } from 'express';
import { getWines, winesByWinery, getSimilarWines, addWine, addWines, editWine } from '../services/winesService.js';

dotenv.config();
const auth = getAuth(app.app);

class WinesController {

  async getWines(_req: Request, res: Response) {
      try {
        const wines = await getWines();
        res.status(200).json(wines);       
      } catch (error) {
        console.error('[ERRORE] getWines: Unable to retrieve wines informations.', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async winesByWinery(req: Request, res: Response) {
    const { winery } = req.body;
    try {
      const wines = await winesByWinery(winery)
      res.status(200).json(wines);
    } catch (error) {
      console.error('[ERROR] winesByWinery. Unable to retrieve wines by winery. ', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getSimilarWines(req: Request, res: Response) {
    const { wine } = req.body;
    console.log('[DEBUG] getSimilarWines in winesControllers. Wine: ', wine);
    try {
      const wines = await getSimilarWines(wine)
      res.status(200).json(wines);
    } catch (error) {
      console.error('[ERROR] getSimilarWines. Unable to retrieve wines by winery. ', error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async editWine(req: Request, res: Response) {
    const { wine } = req.body;
    try {
      const wineID = await editWine(wine);
      res.status(200).json({ id: wineID });
    } catch (error) { 
      console.log('[ERROR] Failed to update wine information. Error:', error);
      res.status(500).json({ error: error });
    }
  }

  
  async getWinesByVintage(_req: Request, _res: Response) {
    
  }

  async addWine(req: Request, res: Response) {
    const { wine } = req.body;
    try {
      const wineID = await addWine(wine);
      res.status(200).json({ id: wineID });
    } catch (error) {
      console.log("[ERROR] Failed to add wine. Error:", error);
      res.status(500).json({ error: "Internal Server Error.", description: error });
    }
  }

  async addWines(req: Request, res: Response) {
    const wines = req.body;

    if (!Array.isArray(wines)) {
      return res.status(400).json({ error: "Request body must be an array of wines." });
    }

    try {
      const addedWines = await addWines(wines)

      res.status(200).json({ wines: addedWines });
    } catch (error) {
      console.error("[ERROR] Failed to add wines. Error:", error);
      res.status(500).json({ error: "Internal Server Error.", description: error });
    }
  }
}

export default new WinesController();