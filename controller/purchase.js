const mysql = require('mysql');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken") 
const { promisify } = require("util");
const nodemailer = require("nodemailer");
const { error } = require('console');
const { json } = require('body-parser');
// MySQL Connection 
let db = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: process.env.DATABASE_PASS,
  database: 'login_crud'});

db.connect((error)=>{
    if(!error){
        console.log('Database Connection Done');
    }else{
        console.log('Database Not Connected');
    }
})
// Add new user
exports.register = (req, res) => {
  const { name,email,password,confirm_password } = req.body;
  // Check already used email or not
  db.query('select email from users where email=?',[email],
  async (error,result)=>{
    if(error){
      console.log(error);
    }
    if(result.length>0){
      return res.status(400).redirect("/regfailed");   
    }
    // Check all input fields are filled or not 
    try {
          const { name,email,password,confirm_password } = 
          req.body;
      if (!name || !email ||!password ||!confirm_password ) {
          {
              return res.status(400).render("/regfailed");             
      }   
  }
 // Store all user input fields
db.query('INSERT INTO login_crud.users SET name = ?, email = ?, password = ?, confirm_password = ?',
     [name,email,password,confirm_password], (err, rows) => {
      if (!err) {
        res.redirect('/regsuccess');       
      } else {
        console.log(err);
      }
    });  
  }catch{
    return res.status(400).render("/regfailed");             

  }
})
}
  // auth.js module exports router login
exports.login = async (req, res) => {
try {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).redirect('/loginfailed');
}  
// Check user email is present or not
db.query(
"select * from users where email=?",
[email],
async (error, result) => {
  if (result.length <= 0) {
    return res.status(400).redirect('/loginfailed');
  }else{
    if ((await bcrypt.compare(password, result[0].password))) {
      return res.status(400).redirect('/loginfailed');
    }
    else{
    const id = result[0].id;
        // JWT JSON Web token create and expires is mentioned days in .env file 90days        // 
        const token = jwt.sign({ id: id }, 
          process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        // Cookie Expire time
        const cookieOptions = {
          expires: new Date(
            Date.now() +
              process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          // Only work on http
          httpOnly: true,
        };
        // cookie stores as a name of Yogesh
        res.cookie("Yogesh", token, cookieOptions);
        res.status(200).redirect("/profile");
    }
  }     
});
} catch (error) {
console.log(error);
}
};
// check user login cookie is present in web browser
exports.profile =  async(req, res,next) => {
if (req.cookies.Yogesh) {
  try {
    const decode = await promisify(jwt.verify)(
      req.cookies.Yogesh,
      process.env.JWT_SECRET
    );
    db.query(
      "select * from users where id=?",
      [decode.id],
      (err, results) => {
        if (!results) {
          return next();
        }
        req.data = results[0];
        return next();
      }
    );
  } catch (error) {
    console.log(error);
    return next();
  }
} 
}




exports.cartitem =  async(req, res) => {

  db.query(
    "select * from login_crud.product",
    (err, results) => {
      if (!results) {
        console.log(results);
      }else{
        console.log(error);
      }
    
    }
  );

}




















exports.purchaseItem = async(req, res) => {
  const{ title,showcasecategory,price,quantity } = req.body;
  productqty = quantity;
  producttitle = title;
  productprice = price;
  productcategory = showcasecategory;




  if (req.cookies.Yogesh) {  
      const decode = await promisify(jwt.verify)(
        req.cookies.Yogesh,
        process.env.JWT_SECRET );
      db.query(
        "select * from users where id=?",
        [decode.id],
        (err, results) => {
      // Assign user email address and customer ID 
      const{ id,name,email } = results[0];         
      //Node mailer sent to user purchase conformation mail          
      // var transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     user: 'yogeshwaran751@gmail.com',
      //     pass: 'donpebnjwujpkjux'
      //   }
      // });
      // var mailOptions = {
      //   from: 'yogeshwaran751@gmail.com',
      //   // User mail address get from user profile
      //   to: `${email}`,
      //   subject: 'YP e-super Market Store',
      //   // User Email receiving Format and other conent
      //   html :   ` 
      //   <!DOCTYPE html>
      //   <html lang="en">
      //   <head>
      //       <meta charset="UTF-8">
      //       <meta http-equiv="X-UA-Compatible" content="IE=edge">
      //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
      //       <title>Thanks Mail YP e-Super Narket</title>
      //   </head> 
      //   <body>
      //   <div style="text-align: center;font-weight: 400; border: 1px solid rgb(24, 24, 24);box-shadow: 2px 1px 2px rgb(241, 3, 222);min-height: 500px;max-width: 500px;padding: 10px;color: rgb(39, 39, 39);font-size: 0.7rem; margin: 5px auto;
      //   background-image: url('https://img.freepik.com/free-vector/autumn-leaves-background_23-2149029956.jpg?w=740&t=st=1681789177~exp=1681789777~hmac=3abe22c8a5e41f6b0ad3dab137426eb815d2a8f8dd9ed81caae101413ef8753d');">
      //   <h1><strong>YP</strong> e-super market.</h1>
      //   <h1><span>${name}</span> Thanks for Purchasing in YP supermarket.</h1>
      //   <h1>Your customer id is <span>${id}</span></h1>
      //   <p style="font-size: 1rem;font-weight: 700;">Visit next time use this coupon.<br>to get 50% discount on all products<br><span style="background-color: rgb(10, 10, 10);padding: 1px;margin-top: 5px;display: inline-block;padding: 10px;color: antiquewhite;">GSGK6422</span> </p>
      //   </div>
      //   <h5 style="text-align: center;bottom:49px; position: relative;font-family: 'Franklin Gothic Medium';padding: 5px;background-color: rgb(138, 45, 245);max-width: 500px;margin: 22px auto;
      //   background: linear-gradient(180deg,rgb(166, 69, 245),rgb(223, 80, 241));">Design  developed by Yogeshwaran</h5>
       
      //   </body>
      //   </html>   `
      // };
      // transporter.sendMail(mailOptions, function(error, info){
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log('Email sent: ' + info.response);
      //   }
      // });
        // Redirect to purchase conformation web page
          // function purchaseredirect() {
          //   res.status(200).redirect("/thanks");
          // }
          // setTimeout(purchaseredirect, 6000);         
        }
      ); 
      cartdisplay();
      function cartdisplay() {
        const{ title,showcasecategory,price,quantity } = req.body;
        productqty = quantity;
        producttitle = title;
        productprice = price;
        productcategory = showcasecategory;

        console.log(req.body);
        console.log((req.body).length);
        addcartitem()
        function addcartitem()
        {
          for (let x = 0; x < array.length; x++) {
            const element = array[index];
            

            let txt = "";
            for (let x in title) {
              txt += title[x] ;
            };
    
              let txt1 = "";
              for (let x in showcasecategory) {
                txt1 += showcasecategory[x] ;
              };
    
    
              let txt2 = "";
              for (let x in price) {
                txt2 += price[x] ;
              };
    
              let txt3 = "";
              for (let x in quantity) {
                txt3 += quantity[x] ;
              };
            
          }
         
        }

          // Store all user input fields
          db.query('INSERT INTO product SET title = ?, category = ?, price = ?, quantity = ?',
          [txt,txt1,txt2,txt3], (err, rows) => {
          if (!err) {
            res.redirect('/cartitem');       
            console.log(rows);
          } else {
            console.log(err);          
            res.redirect('/cartitemfailed');   
          }  });  
      }
  } else {
    res.status(200).redirect("/");
  }

  
 
  // Future Update sending user purchased items list in excel or pdf format in 
  // Excel using XLSX npm package  
  // for (let index = 0; index < title.length; index++) {
  //   const el_category = title[index] ;
  //   const el_qty = quantity[index];
  //   const el_price = price[index];
// const students = [
//   { name: el_category, email: el_qty, age: el_price }
// ]

// const convertJsonToExcel = () => {

//   const workSheet = XLSX.utils.json_to_sheet(students);
//   const workBook = XLSX.utils.book_new();

//   XLSX.utils.book_append_sheet(workBook, workSheet, "students")
//   // Generate buffer
//   XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })

//   // Binary string
//   XLSX.write(workBook, { bookType: "xlsx", type: "binary" })

//   XLSX.writeFile(workBook, "studentsData.xlsx")
// }
// convertJsonToExcel()
// }
// program to display a text using setTimeout method
}


exports.logout = async (req, res) => {
  res.cookie("Yogesh","logout",{
    expires:new Date(Date.now()*2*1000),
    httpOnly:true
  });
  res.status(200).redirect("/")
}
