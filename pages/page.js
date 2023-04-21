const express = require('express');
const router = express.Router();
const controller = require("../controller/purchase");
router.get('/',(req,res)=>{ res.render('home')})
router.get('/login',(req,res)=>{ res.render('login')})
router.get("/logout", controller.logout);

router.get('/createaccount',(req,res)=>{ res.render('createaccount')})

router.get('/icecream',(req,res)=>{ res.render('icecream')})

router.get('/addtocart',(req,res)=>{ res.render('addtocart')})

router.get('/fruit',(req,res)=>{ res.render('fruit')})

router.get('/vegetable',(req,res)=>{ res.render('vegetables')})

router.get('/snack',(req,res)=>{ res.render('snack')})

router.get('/dailyessentials',(req,res)=>{res.render('dailyessentials')})

router.get('/juice',(req,res)=>{res.render('juice')})

router.get('/meat',(req,res)=>{ res.render('meat')})

router.get('/purchase',(req,res)=>{ res.render('purchase')});

router.get('/thanks',controller.profile,(req,res)=>{ res.render('thanks',
{ data: req.data })});

router.get('/regsuccess',(req,res)=>{  res.render('regsuccess')}) 

router.get('/regfailed',(req,res)=>{ res.render('regfailed')}) 

router.get('/loginfailed',(req,res)=>{ res.render('loginfailed')}) 

router.get('/cartitem',controller.cartitem,(req,res)=>{  res.render('cartitem')}) 

router.post('/cartitem',(req,res)=>{  res.render('cartitem')}) 

router.get('/cartitemfailed',(req,res)=>{  res.render('cartitemfailed')}) 

router.post('/purchaseItem',controller.purchaseItem)

router.get('/profile',controller.profile,
(req,res,next)=>{
    if (req.data) { res.render("profile", 
    { data: req.data });
} else { res.redirect("/login"); }

});

module.exports = router;

