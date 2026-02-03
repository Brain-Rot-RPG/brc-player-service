import { Request, Response, NextFunction } from 'express';
import { Player } from '../models/player';
import pool from '../db/db';

export const createPlayer = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { level, brainrotId, inventory, gold } = req.body;
        const newPlayer: Player = { level, brainrotId, inventory, gold };
        const query = 'INSERT INTO player (level, brainrotId, inventory, gold) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [newPlayer.level, newPlayer.brainrotId, newPlayer.inventory, newPlayer.gold];
        pool.query(query, values)
            .then((result) => {
                res.status(201).json(result.rows[0]);
            })
            .catch((error) => {
                next(error);
            });
    } catch (error) {
        next(error);
    }
};

export const getPlayers = (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = 'SELECT * FROM player';
    pool.query(query)
      .then((result) => {
        res.json(result.rows);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

export const getPlayerById = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const query = 'SELECT * FROM player WHERE id = $1';
    const values = [id];
    pool.query(query, values)
      .then((result) => {
        if (result.rows.length === 0) {
          res.status(404).json({ message: 'Player not found' });
          return;
        }
        res.json(result.rows[0]);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

export const updatePlayer = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { level, brainrotId, inventory, gold } = req.body;
    const query = 'UPDATE player SET level = $1, brainrotId = $2, inventory = $3, gold = $4 WHERE id = $5 RETURNING *';
    const values = [level, brainrotId, inventory, gold, id];
    pool.query(query, values)
      .then((result) => {
        if (result.rows.length === 0) {
          res.status(404).json({ message: 'Player not found' });
          return;
        }
        res.json(result.rows[0]);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

export const deletePlayer = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const query = 'DELETE FROM player WHERE id = $1 RETURNING *';
    const values = [id];
    pool.query(query, values)
      .then((result) => {
        if (result.rows.length === 0) {
          res.status(404).json({ message: 'Player not found' });
          return;
        }
        res.json({ message: 'Player deleted successfully' });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

export const updateGold = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { gold } = req.body;
    const query = 'UPDATE player SET gold = $1 WHERE id = $2 RETURNING *';
    const values = [gold, id];
    pool.query(query, values)
      .then((result) => {
        if (result.rows.length === 0) {
          res.status(404).json({ message: 'Player not found' });
          return;
        }
        res.json(result.rows[0]);
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};

export const addItemToInventory = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { itemId } = req.body;
    const getQuery = 'SELECT inventory FROM player WHERE id = $1';
    const getValues = [id];
    pool.query(getQuery, getValues)
      .then((result) => {
        if (result.rows.length === 0) {
          res.status(404).json({ message: 'Player not found' });
          return;
        }
        const inventory: number[] = result.rows[0].inventory;
        inventory.push(itemId);
        const updateQuery = 'UPDATE player SET inventory = $1 WHERE id = $2 RETURNING *';
        const updateValues = [inventory, id];
        pool.query(updateQuery, updateValues)
          .then((updateResult) => {
            res.json(updateResult.rows[0]);
          })
          .catch((error) => {
            next(error);
          });
      })
      .catch((error) => {
        next(error);
      });
  } catch (error) {
    next(error);
  }
};