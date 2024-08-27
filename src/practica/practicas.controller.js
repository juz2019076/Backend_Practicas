import { response, request } from "express";
import Practicas from "../practica/practicas.js";

export const practicaGet = async (req, res) => {
    const { limite, desde } = req.query;
    const query = {};

    try {

        const [total, practicas] = await Promise.all([
            Practicas.countDocuments(query),
            Practicas.find(query)
                .skip(Number(desde) || 0)
                .limit(Number(limite) || 10)
        ]);

        res.status(200).json({
            total,
            practicas
        });

    } catch (e) {
        console.error('Error fetching company:', e);
        res.status(500).json({ msg: 'Error fetching companys' });
    }

}