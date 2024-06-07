const express = require('express');
const fs = require('fs');
const ejs = require('ejs');
const app = express();
const session = require('express-session');
const formidable = require('formidable');

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);
app.use(express.static("views"));
app.use(session({
  secret: 'abcdefg',
  resave: true,
  saveUninitialized: false,
}));

app.use(function (req, res, next) {
  res.status(404).render('404'); 
});

verifica = (user, password) => {
  console.log("in verifica");
    usersFile = JSON.parse(fs.readFileSync('./users.json'));
    console.log(usersFile);
    for(let u in usersFile){
      console.log(usersFile.username);
      if(usersFile[u].username == user && usersFile[u].password == password){
        console.log(`gasit: ${user}`);
        return user;
      } 
    }
    return null;
    
}

app.get('/', (req, res) => {
  res.render('log.ejs')
})

app.post('/login', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
         user =  verifica(fields.username, fields.parola);
         // verificarea datelor de login
         
         if(user){
           req.session.username = user; 
           // setez userul ca proprietate a sesiunii
           console.log("logat");
           res.redirect('/logat'); }
         else
           req.session.username = false;
    });
});

app.get('/logat', (req, res) => {
  res.render('index.html', {"nume": req.session.username})
  
})


app.get('/logout', function(req, res) {
    req.session.destroy(); 
    // distrugem sesiunea la intrarea pe pagina de logout
    res.render('log.ejs');
}); 

app.listen('8000');