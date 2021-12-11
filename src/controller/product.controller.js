const express = require('express');

const router = express.Router();

const Product = require("../models/product.model");

const redis = require("../configs/redis")




router.post("", async function(req, res){
    const products = await Product.create(req.body);

    const product = await Product.find();

    redis.set("products",JSON.stringify(product));

    return res.status(200).send(products);
})

router.get("",async (req, res)=>{

    redis.get("products",async (err,products)=>{
        console.log("Products",products);

        if(err) console.log(err);

        if(products) return res.status(200).send({products:JSON.parse(products)});

        const All_products = await Product.find().lean().exec();

        redis.set("All_products",JSON.stringify(All_products));

        return res.status(200).send({db_products:All_products});
    });
});


router.get("/:id",async (req, res)=>{

    redis.get(`products.${req.params.id}`,async (err,products)=>{

        if(err) console.log(err);

        if(products) return res.status(200).send({cached_products:JSON.parse(products)});

        const All_products = await Product.findById(req.params.id).lean().exec();

        redis.set(`All_products,${req.params.id}`, JSON.stringify(All_products));

        return res.status(200).send({db_products:All_products});
    });
});


router.patch("/:id",async (req, res)=>{

   const product = await Product.findByIdAndUpdate(req.params.id, req.body,{new:true});

   redis.set(`All_products${req.params.id}`, JSON.stringify(product));

    const All_products = await Product.find().lean().exec();

    redis.set("All_products",JSON.stringify(All_products));

    return res.status(200).send(product);
});


router.delete("/:id",async (req, res)=>{

    const product = await Product.findByIdAndDelete(req.params.id);
 
    redis.del(`All_products${req.params.id}`);
 
     const All_products = await Product.find().lean().exec();
 
     redis.set("All_products",JSON.stringify(All_products));
 
     return res.status(200).send(product);
 });


module.exports = router;