const express = require ('express');
const app = express();
const path = require ('path');
const session = require('express-session');
const dotenv = require('dotenv');

dotenv.config();

const secretkey = process.env.SECRET_KEY || 'your-fallback-secret-key';
const port = process.env.PORT || 3000;

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret :secretkey,
    resave:false,
    saveUninitialized:false
})); 

app.get('/',(req,res) =>{
    const{error, convertedTemp , fromUnit,toUnit } = req.session; // to take userinput
    res.render('index',{
        error:error || null,
        convertedTemp: convertedTemp || null,
        fromUnit: fromUnit || null,
        toUnit : toUnit || null,
        conversionHistory : req.session.conversionHistory || []
    });

    req.session.error = null; //to clear blank box after taking input
    req.session.covertedTemp = null;
    req.session.fromUnit = null;
    req.session.toUnit = null;
});


app.post('/convert',(req,res)=>{
    let temp = parseFloat(req.body.temp); //to convert int to float
    let fromUnit = req.body.fromUnit;
    let toUnit = req.body.toUnit;
    let convertedTemp = temp ;
    let error = null;

    if(isNaN(temp)){
        error = "Please enter a valid number";
    }
    else{
        if(fromUnit ==='celcius' && toUnit === 'fahrenheit'){
            convertedTemp = (temp*9/5)+32;
        }
        else if(fromUnit === 'fahrenheit' && toUnit === ' celcius'){
            convertedTemp = (temp-32)*(5/9);
        }
        else{
            convertedTemp = temp;
        }
    }
    if(!req.session.conversionHistory){
        req.session.conversionHistory = [];
    }

    if(!error){
        req.session.conversionHistory.push({
            temp,
            fromUnit,
            toUnit,
            convertedTemp
        });
    }

    req.session.error = error;
    req.session.convertedTemp = convertedTemp;
    req.session.fromUnit = fromUnit;
    req.session.toUnit = toUnit;

    res.redirect('/');


});
app.listen(port , ()=> {
    console.log(`Server is running on port ${port}`);

});



