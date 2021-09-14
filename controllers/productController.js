const Product = require("../models/productModel");

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.store = async (req, res, next) => {
  const { title, image, highest_price, variations } = req.body;

  const product = await Product.create({
    title,
    image,
    highest_price,
    variations,
  });
  if (!product) {
    return res.status(406).json("something went wrong.");
  }

  res.status(201).json("Successfully Created.");
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.addNewVariation = async (req, res, next) => {
  const productId = req.params.id;
  const { variations } = req.body;

  const variation = {
    $push: {
      variations: {
        storage: {
          size: variations.storage.size,
          deduction: variations.storage.deduction,
        },
        colour: {
          title: variations.colour.title,
          deduction: variations.colour.deduction,
        },
      },
    },
  };

  const product = await Product.findByIdAndUpdate(productId, variation);
  if (!product) {
    return res.status(404).json("Product not found.");
  }

  res.status(200).json("Pushed Successfully.");
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.removeVariation = async (req, res, next) => {
  const { productId, variationId } = req.body;

  const product = await Product.findByIdAndUpdate(productId,{
      $pull : { variations: { _id : variationId}}
  });
  if (!product) {
    return res.status(404).json("Product not found.");
  }

  res.status(200).json("Poped Successfully.");
};

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.addNewCondition = async(req, res, next) =>{
  const productId = req.params.id ;
  const { conditions } = req.body;

  const condition = {
    $push :{
      conditions :{
        title : conditions.title,
        deduction: conditions.deduction
      }
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(productId, condition);
  if (!updatedProduct) {
    return res.status(404).json("Product not found.");
  }

  res.status(200).json("Pushed Successfully.");
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.removeCondition = async(req, res, next) =>{
  const { productId , conditionsId } = req.body ;

  const updatedProduct = await Product.findByIdAndUpdate(productId, {
    $pull:{ conditions : { _id : conditionsId}}
  });
  if (!updatedProduct) {
    return res.status(404).json("Product not found.");
  }

  res.status(200).json("Poped Successfully.");

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.addNewQuestion = async(req, res, next) =>{
  const productId = req.params.id ;
  const { questions } = req.body ;

  const question ={
    $push :{
      questions:{
        title: questions.title,
        deduction: questions.deduction
      }
    }
  }
  const updatedProduct = await Product.findByIdAndUpdate(productId, question);
  if (!updatedProduct) {
    return res.status(404).json("Product not found.");
  }

  res.status(200).json("Pushed Successfully.");
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.removeQuestion = async(req, res, next) =>{
  const { productId , questionId } = req.body ;

  const updatedProduct = await Product.findByIdAndUpdate(productId, {
    $pull:{ questions : { _id : questionId}}
  });
  if (!updatedProduct) {
    return res.status(404).json("Product not found.");
  }

  res.status(200).json("Poped Successfully.");

}
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.delete = async(req, res, next ) =>{
    const productId = req.params.id;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
        return res.status(404).json("Product not found.");
      }
    
      res.status(200).json("Delete Successfully.");

}
