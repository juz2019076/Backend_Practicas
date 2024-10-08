import { response, request } from "express";
import Registro from "../registro/registro.js";

export const registroGet = async (req, res) => {

    const { limite , desde , orden = 'asc', campo } = req.query; 
    const query = {};
    const sort = {};

    if (campo) {
        sort[campo] = orden === 'desc' ? -1 : 1; 
    }


    try {
        const [total, registro] = await Promise.all([
            Registro.countDocuments(query),
            Registro.find(query)
                .sort(sort) 
                .skip(Number(desde)) 
                .limit(Number(limite)) 
        ]);

        res.status(200).json({
            total,
            registro
        });

    } catch (e) {
        console.error('Error fetching practica:', e);
        res.status(500).json({ msg: 'Error fetching practica' });
    }
};