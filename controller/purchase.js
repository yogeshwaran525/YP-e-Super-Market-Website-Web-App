const mysql = require('mysql');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken") 
const { promisify } = require("util");
// const userController = require("../controller/user");
// Connection Pool
let db = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: 'root123',
  database: 'login_crud'
});

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
  console.log(req.body);
  db.query('select email from users where email=?',[email],
  async (error,result)=>{
    if(error){
      console.log(error);
    }
    if(result.length>0){
      return res.status(400).render("/createaccfailed");             
      // return res.status(400).render("createaccount"); 
    }
    try {
          const { name,email,password,confirm_password } = req.body;
      if (!name || !email ||!password ||!confirm_password ) {
          {
              return res.status(400).render("/createaccfailed");             
      }   
  }
 // User the connection
    db.query('INSERT INTO login_crud.users SET name = ?, email = ?, password = ?, confirm_password = ?',
     [name,email,password,confirm_password], (err, rows) => {
      if (!err) {
        res.redirect('/loginok');
        function slogin(){
          res.status(200).render('fruit')
        }
        setTimeout(slogin,3000)
      } else {
        console.log(err);
      }
    });
  
  }catch{
    console.log("Update error on fields.")
  }

})
}



  // auth.js module exports router login
exports.login = async (req, res) => {
  console.log(req.body);
try {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).redirect('/loginfailed');
    ;    
}  

db.query(
"select * from users where email=?",
[email],
async (error, result) => {
  // console.log(result);
  if (result.length <= 0) {
    return res.status(400).redirect('/loginfailed');
  }else{
    if ((await bcrypt.compare(password, result[0].password))) {
      return res.status(400).redirect('/loginfailed');
    }
    else{
    const id = result[0].id;
        // JWT JSON Web token create and expires is mentioned days in .env file 90days
        // 
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
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
        // console.log(cookieOptions);
        res.cookie("Yogesh", token, cookieOptions);
        res.status(200).redirect("/");
    }
  }     
}
);
} catch (error) {
console.log(error);
}
};

exports.profile =  async(req, res,next) => {
console.log(req.cookies);
if (req.cookies.Yogesh) {
  try {
    const decode = await promisify(jwt.verify)(
      req.cookies.Yogesh,
      process.env.JWT_SECRET
    );
    console.log(decode);
    db.query(
      "select * from users where id=?",
      [decode.id],
      (err, results) => {
        console.log(results);
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
} else {
  next();
}

}



exports.purchaseItem = (req, res) => {
  const{ quantity,title,price,total } = req.body;
  console.log(req.body);
  // console.log(title)
  // for (let index = 0; index < title.length; index++) {
  //   const el_category = title[index] ;
  //   const el_qty = quantity[index];
  //   const el_price = price[index];
    

// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'yogeshwaran751@gmail.com',
//     pass: 'donpebnjwujpkjux'
//   }
// });

// var mailOptions = {
//   from: 'yogeshwaran751@gmail.com',
//   to: 'sridhar7441@gmail.com',
//   subject: 'YP e-super Market Store',
//   html :   `
//   <h1>THANKS FOR PURCHASING IN <strong>YP</strong> e-super market.</h1>
  
//  `
  
      
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });



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
function purchaseredirect() {
  res.status(200).redirect("/");
}
setTimeout(purchaseredirect, 6000);
}
