import { response, request } from "express";
import Practicas from "../practica/practicas.js";

export const practicaGet = async (req, res) => {
    
    const { limite , desde , orden = 'asc', campo } = req.query; 
    const query = {};
    const sort = {};

    if (campo) {
        sort[campo] = orden === 'desc' ? -1 : 1; 
    }


    try {
        const [total, practicas] = await Promise.all([
            Practicas.countDocuments(query),
            Practicas.find(query)
                .sort(sort) 
                .skip(Number(desde)) 
                .limit(Number(limite)) 
        ]);

        res.status(200).json({
            total,
            practicas
        });

    } catch (e) {
        console.error('Error fetching practica:', e);
        res.status(500).json({ msg: 'Error fetching practica' });
    }
};