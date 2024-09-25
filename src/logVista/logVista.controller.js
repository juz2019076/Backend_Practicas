import Logvista from "./logVista.js"; // Importa el modelo Usuario desde log.js
import { response, request } from "express";

export const logVistaGet = async (req, res) => {
    const { limite, desde, orden = 'asc', campo } = req.query;
    const query = {};
    const sort = {};

  
    if (campo) {
        sort[campo] = orden === 'desc' ? -1 : 1; 
    }

    try {
        const [total, logvista] = await Promise.all([
            Logvista.countDocuments(query), 
            Logvista.find(query)
                .sort(sort) 
                .skip(Number(desde)) 
                .limit(Number(limite)) 
        ]);

        res.status(200).json({
            total,
            logvista
        });

    } catch (e) {
        console.error('Error fetching usuarios:', e);
        res.status(500).json({ msg: 'Error fetching usuarios' });
    }
};


export const postLogVista = async (req, res) => {

    const { usuario, pagina } = req.body;
    const logVista = new Logvista ({usuario, pagina})

    await logVista.save();

    res.status(200).json({
        logVista
    });

}
