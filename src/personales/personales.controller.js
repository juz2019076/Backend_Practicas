import { response, request } from "express";
import Personales from "../personales/personales.js";

export const personalGet = async (req, res) => {
    const { limite, desde, orden, campo } = req.query;
    const query = {};
    const sort = {};

    if (campo) {
        sort[campo] = orden === 'desc' ? -1 : 1;
    }

    try {

        const [total, personal] = await Promise.all([
            Personales.countDocuments(query),
            Personales.find(query)
                .skip(Number(desde) || 0)
                .limit(Number(limite) || 10)
        ]);

        res.status(200).json({
            total,
            personal
        });

    } catch (e) {
        console.error('Error fetching company:', e);
        res.status(500).json({ msg: 'Error fetching companys' });
    }

}