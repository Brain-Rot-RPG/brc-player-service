import { Router } from 'express';
import {
  createPlayer,
  getPlayers,
  getPlayerById,
  updatePlayer,
  deletePlayer,
  updateGold,
  addItemToInventory
} from '../controllers/playerController';

const router = Router();

router.get('/', getPlayers);
router.get('/:id', getPlayerById);
router.post('/', createPlayer);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);
router.patch('/:id/gold', updateGold);
router.patch('/:id/inventory', addItemToInventory);

export default router;