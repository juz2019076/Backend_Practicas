import { response, request } from "express";
import Empresa from "../empresa/empresa.js";

export const empresaGet = async (req, res) => {
    const { limite, desde, orden, campo } = req.query;
    const query = {};
    const sort = {};

    if (campo) {
        sort[campo] = orden === 'desc' ? -1 : 1;
    }

    try {

        const [total, empresa] = await Promise.all([
            Empresa.countDocuments(query),
            Empresa.find(query)
                .skip(Number(desde) || 0)
                .limit(Number(limite) || 10)
        ]);

        res.status(200).json({
            total,
            empresa
        });

    } catch (e) {
        console.error('Error fetching company:', e);
        res.status(500).json({ msg: 'Error fetching companys' });
    }

}