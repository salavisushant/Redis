const mongoose= require("mongoose");

const productSchema = new mongoose.Schema({
    product_name:{type:String, required:true},
    price:{type:Number, required:true}
},{
    versionKey:false,
    timestamps:true,
})

module.exports =mongoose.model("products",productSchema)