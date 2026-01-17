import { Products } from "../models/products.model.js";

const createProducts = async (req, res)=>{
        try {
            const { CPU, GPU, RAM, STORAGE, CASE } = req.body;
            
            const newProducts = await Products.create({ 
                CPU,
                GPU,
                RAM,
                STORAGE,
                CASE
            });

        
            // await newProducts.save();
            res.status(201).json({
                message: "Product created successfully!", 
                products:{
                    newProducts
                } 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Internal Server Error"})
        }

}


const getallProducts = async (req, res)=>{
    try {
        const allProducts = await Products.find()

        res.status(200).json({
            message: "All products retrieved successfully",
            allProducts
        })
 
        
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"})
    }

}


const updateProduct = async (req, res)=>{
    try {
        if(!req.body || Object.keys(req.body).length === 0 ){
            return res.status(400).json({
                message: "Please provide data for update"
            });
        }
        const update = await Products.findByIdAndUpdate(req.params.id, req.body,{
            new: true
        })

        if(!update){
            return res.status(404).json({
                message: "Product not found"
            });
        }
        
        res.status(200).json({
            message: "Product updated successfully",
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

const deleteProducts = async (req, res)=>{
    try {
        const { id } = req.params;

        const deleteProduct = await Products.findByIdAndDelete(id)

        if(!deleteProduct){
            return res.status(404).json({
                message: "Product not found"
            });
        }
        
        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export {
    createProducts,
    getallProducts,
    deleteProducts,
    updateProduct
}