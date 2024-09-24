import Usuario from "./logVista.js"; // Importa el modelo Usuario desde log.js

export const usuarioGet = async (req, res) => {
    const { limite, desde, orden = 'asc', campo } = req.query;
    const query = {};
    const sort = {};

  
    if (campo) {
        sort[campo] = orden === 'desc' ? -1 : 1; 
    }

    try {
        const [total, usuarios] = await Promise.all([
            Usuario.countDocuments(query), 
            Usuario.find(query)
                .sort(sort) 
                .skip(Number(desde)) 
                .limit(Number(limite)) 
        ]);

        res.status(200).json({
            total,
            usuarios
        });

    } catch (e) {
        console.error('Error fetching usuarios:', e);
        res.status(500).json({ msg: 'Error fetching usuarios' });
    }
};
