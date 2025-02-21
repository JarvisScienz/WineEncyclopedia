import { Request, Response } from 'express';
import updateWineTastedCollection from '../script/script-update-document.js';
  
class ScriptController {
async updateWinesTasted(_req: Request, res: Response) {
    try {
      
      const wineries = await updateWineTastedCollection();
  
        res.status(200).json(wineries);
      } catch (error) {
        console.error('[ERROR] getWienries. Unable to retrieve wineries informations.', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }}

export default new ScriptController();