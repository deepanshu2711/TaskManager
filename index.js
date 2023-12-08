import express from "express";
import bodyParser from "body-parser";
import pg from "pg";





const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));


const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    password:"",
    port:5432,
    database: "world"
})

db.connect();

async function checkTask(){
    const result = await  db.query("select * from task_manager order by id asc");
    let  tasksList = [];
    result.rows.forEach(element => {
        tasksList.push(element)
    });
    return tasksList;

}


app.get('/' , async(req,res)=>{
    const allTasks  = await checkTask();
    res.render("index.ejs" ,{content : allTasks});
})

app.post('/add' , async(req,res)=>{
    const input = req.body['input'];
    await db.query("insert into task_manager (task) values ($1) " ,[input])
    res.redirect('/');
})

app.post('/delete/:id' , async(req,res) =>{
    const idtodel = req.params.id;
    
    await db.query("delete from task_manager where id = $1",[idtodel])
    res.redirect('/');

    
})

app.post("/edit", async (req, res) => {
    const item = req.body.updatedItemTitle;
    const id = req.body.updatedItemId;
  
    try {
      await db.query("UPDATE task_manager SET task = ($1) WHERE id = $2", [item, id]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });




app.listen(3000 , ()=>{
    console.log("Server running at port 3000 : ")
})