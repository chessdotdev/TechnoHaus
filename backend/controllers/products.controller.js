import { Products } from "../models/products.model.js";

const createProducts = async (req, res)=>{
        try {
            const {
                 CPU, 
                 GPU, 
                 RAM, 
                 STORAGE,
                 CASE, 
                 image, 
                 price, 
                 category, 
                 name, 
                 brand, 
                 description
                } = req.body;

                if(!price){
                    return res.status(400).json({message: "Price is Required"});
                }

                if(!category || category === "Pc Build"){
                  if (!CPU) return res.status(400).json({ message: "CPU is required for PC Build" });
                }else{
                  if (!name) return res.status(400).json({ message: "Name is required" });
                }
            
            const newProducts = await Products.create({ 
                CPU,
                GPU,
                RAM,
                STORAGE,
                CASE,
                name,
                brand,
                description,
                category: category || "Pc Build",
                price,
                image
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
        const { category } = req.query; //?category=Peripheral

        const filter = category ? { category } : {}

        const allProducts = await Products.find(filter).sort({ createdAt: -1 });
        

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