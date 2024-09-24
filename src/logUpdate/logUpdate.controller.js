import { response, request } from "express";
import logUpdate from "./logUpdate.js";

export const logUpdateGet = async (req, res) => {
    const { limite , desde , orden = 'asc', campo } = req.query; 
    const query = {};
    const sort = {};

    if (campo) {
        sort[campo] = orden === 'desc' ? -1 : 1; 
    }


    try {
        const [total, logupdate] = await Promise.all([
            logUpdate.countDocuments(query),
            logUpdate.find(query)
                .sort(sort) 
                .skip(Number(desde)) 
                .limit(Number(limite)) 
        ]);

        res.status(200).json({
            total,
            logupdate
        });

    } catch (e) {
        console.error('Error fetching logUpdate:', e);
        res.status(500).json({ msg: 'Error fetching logUpdate' });
    }
};