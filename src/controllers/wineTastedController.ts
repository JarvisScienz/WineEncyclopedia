import { Request, Response } from 'express';

import { getWinesByColorService, getWinesTastedService, getWineTastedInYears, addWineTastedService } from '../services/wineTastedService.js';

class WineTastedController{

    async getWinesByColor(req: Request, res: Response) {
        const { color } = req.body;
        var color1="", color2="", color3="", color4="";
        switch  (color){
        case "red":
          color1 = "red_purplish";
          color2 = "red_ruby";
          color3 = "red_garnet";
          color4 = "red_orange";
          break;
        case "yellow":
          color1 = "yellow_greenish";
          color2 = "yellow_straw";
          color3 = "yellow_golden";
          color4 = "yellow_amber";
          break;
        case "rose":
          color1 = "rose_soft";
          color2 = "rose_coppery";
          color3 = "rose_cherry";
          color4 = "rose_claret";
          break;
        }
        try {
          const colorsArray = [color1, color2, color3, color4];
          const wines = await getWinesByColorService(colorsArray);
      
            res.status(200).json(wines);
          } catch (error) {
            console.error('[ERROR] getWineByColor. Unable to retrieve wines by color. ', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
      }

      async getWinesTasted(req: Request, res: Response) {
          const { uid } = req.body;
          if (!uid ) {
            return res.status(422).json({
              uid: "UID is required"
            });
          }
          try {
              const wines = await getWinesTastedService(uid);
              res.status(200).json(wines);
            } catch (error) {
              console.error('[ERROR] getWinetasted. Unable to retrieve wines tasted. ', error);
              res.status(500).json({ error: "Internal Server Error" });
          }
        }


    async getWineTastedInYears(req: Request, res: Response) {
        const { uid } = req.body;
        if (!uid ) {
          return res.status(422).json({
            uid: "UID is required"
          });
        }
        try {
            const winesCount = await getWineTastedInYears(uid);
      
            res.status(200).json(winesCount);
          } catch (error) {
            console.error('[ERROR] getWineTastedInYears. Unable to retrieve wines tasted in years. ', error);
            res.status(500).json({ error: "Internal Server Error" });
        }
      }

    async addWineTasted(req: Request, res: Response) {
        const { wine } = req.body;
        try {
        const newWineID = await addWineTastedService(wine);
        res.status(200).json({ id: newWineID });
        } catch (error) {
        console.error('[ERROR] addWineTasted. Unable to add new wine tasted. ', error);
        res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

export default new WineTastedController();