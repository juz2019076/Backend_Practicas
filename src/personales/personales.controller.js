import { response, request } from "express";
import Personales from "../personales/personales.js";

export const personalGet = async (req, res) => {
    const { limite , desde , orden = 'asc', campo } = req.query; 
    const query = {};
    const sort = {};

    if (campo) {
        sort[campo] = orden === 'desc' ? -1 : 1; 
    }


    try {
        const [total, personal] = await Promise.all([
            Personales.countDocuments(query),
            Personales.find(query)
                .sort(sort) 
                .skip(Number(desde)) 
                .limit(Number(limite)) 
        ]);

        res.status(200).json({
            total,
            personal
        });

    } catch (e) {
        console.error('Error fetching personal:', e);
        res.status(500).json({ msg: 'Error fetching personal' });
    }
};