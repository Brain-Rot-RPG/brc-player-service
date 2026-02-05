import { Request, Response, NextFunction } from 'express';
import { Player } from '../models/player.js';
import pool from '../db/db.js';

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

    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (level !== undefined) {
      fields.push(`level = $${paramIndex++}`);
      values.push(level);
    }
    if (brainrotId !== undefined) {
      fields.push(`"brainrotId" = $${paramIndex++}`);
      values.push(brainrotId);
    }
    if (inventory !== undefined) {
      fields.push(`inventory = $${paramIndex++}`);
      values.push(inventory);
    }
    if (gold !== undefined) {
      fields.push(`gold = $${paramIndex++}`);
      values.push(gold);
    }

    if (fields.length === 0) {
       res.status(400).json({ message: 'No fields provided for update' });
       return;
    }

    values.push(id);
    const query = `UPDATE player SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

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
        let inventory = result.rows[0].inventory;
        // Ensure inventory is an array
        if (!Array.isArray(inventory)) {
          inventory = inventory ? [inventory] : [];
        }
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