import { response, request } from "express";
import Empresa from "../empresa/empresa.js";

export const empresaGet = async (req, res) => {

    const { limite , desde , orden = 'asc', campo } = req.query; 
    const query = {};
    const sort = {};

    if (campo) {
        sort[campo] = orden === 'desc' ? -1 : 1; 
    }


    try {
        const [total, empresa] = await Promise.all([
            Empresa.countDocuments(query),
            Empresa.find(query)
                .sort(sort) 
                .skip(Number(desde)) 
                .limit(Number(limite)) 
        ]);

        res.status(200).json({
            total,
            empresa
        });

    } catch (e) {
        console.error('Error fetching empresa:', e);
        res.status(500).json({ msg: 'Error fetching empresa' });
    }
};