const Product = require("../models/productModel");

/**
 * 
 */

exports.store = async(req, res, next) =>{
    const { title, image, highest_price, variations } = req.body ;

    const product = await Product.create({
        title,
        image,
        highest_price,
        variations
    });
    if(!product){
       return res.status(406).json("something went wrong.");
    }

    res.status(201).json("Successfully Created.");
};

/**
 *  
 */
exports.addNewVariation = async(req, res, next) =>{
    const productId = req.params.id ;
    const { variations } = req.body ;

    const variation = {
        $push:{
            variations:{
                storage:{
                    size: variations.storage.size,
                    deduction: variations.storage.deduction
                },
                colour:{
                    title: variations.colour.title,
                    deduction: variations.colour.deduction
                }
            }
        }
    }

    const product = await Product.findByIdAndUpdate(productId, variation);
    if(!product){
        return res.status(404).json("Product not found.");
     }
     
     res.status(200).json("Pushed Successfully.")
}