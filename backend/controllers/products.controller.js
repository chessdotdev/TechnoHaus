import { Products } from "../models/products.model.js";

const createProducts = async (req, res)=>{
        try {
            const { CPU, GPU, RAM, MOTHERBOARD, STORAGE, PSU, CASE } = req.body;
            
            const newProducts = await Products.create({ 
                CPU,
                GPU,
                RAM,
                MOTHERBOARD,
                STORAGE,
                PSU,
                CASE
            });
            // await newProducts.save();
            res.status(201).json({
                message: "Product created successfully!", products: {
                    id: newProducts._id,
                    CPU: newProducts.CPU,
                    GPU: newProducts.GPU,
                    RAM: newProducts.RAM,
                    MOTHERBOARD: newProducts.MOTHERBOARD,
                    STORAGE: newProducts.STORAGE,
                    PSU: newProducts.PSU,
                    CASE: newProducts.CASE,

                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"})
        }

}



export {
    createProducts
}