 express=require("express");
const app=express();

app.listen(2000,()=>{
    console.log("Server started...");
});
let scheme1=[
    {"id":"1", "name":"Sai Dhruva Theratipally", "phone":"9392334319","pay":[]},
    {"id":"2", "name":"Kavitha Theratipally", "phone":"9059189555","pay":[]},
    {"id":"3", "name":"Sridhar Theratipally", "phone":"9866238552","pay":[]},
    {"id":"4", "name":"Janardhan Theratipally", "phone":"9985566432","pay":[]}
];

let scheme2=[
    {"id":"1", "name":"Sathvik Narayana", "phone":"7842734279","pay":[]},
    {"id":"2", "name":"Venu Gopal Tatikonda", "phone":"9392858496","pay":[]},
    {"id":"3", "name":"Rishi Vanama", "phone":"8328129191","pay":[]},
    {"id":"4", "name":"Harsha Meda", "phone":"6301586841","pay":[]}
];

let schemes=[scheme1,scheme2];

//To get details of all existing customers in a scheme

app.get("/schemes-get/:n",(req,res)=>{
    let n=req.params.n-1;
    let scheme=schemes[n];
    if(scheme){
        res.status(200).json(scheme);
    }else{
        res.status(404).json({"msg":"Please enter valid scheme id"});
    }
});

//To get customer details in a scheme

app.get("/schemes-get-cust/:n/:id",(req,res)=>{
    let n=req.params.n-1;
    let id=req.params.id;
    let scheme=schemes[n];
    let cust=scheme.find(c=>c.id==id);
    if(cust){
        res.status(200).json(cust);
    }else{
        res.status(404).json({"message":"Customer not found"})
    }
})

app.use(express.json())

//To add dates of payments for each month

app.put("/schemes-push-payment/:n/:id",(req,res)=>{
    let n=req.params.n-1;
    let id=req.params.id;
    let scheme=schemes[n];
    let cust=scheme.find(c=>c.id==id);
    let month=req.body.month;
    let date=req.body.date;
    if(cust){
        cust.pay[month-1]=date;
        res.status(200).json(cust);
    }else{
        res.status(404).json({"message":"Customer not found"});
    }
})

//To get payment details of a customer in a scheme

app.get("/schemes-get-cust-pay/:n/:id",(req,res)=>{
    let n=req.params.n-1;
    let id=req.params.id;
    let scheme=schemes[n];
    let cust=scheme.find(c=>c.id==id);
    if(cust){
        res.status(200).json(cust.pay);
    }else{
        res.status(404).json({"message":"Customer not found"})
    }
})

//List of customers who did not pay for a month in a scheme

app.get("/schemes-get-notpay/:n",(req,res)=>{
    let n=req.params.n-1;
    let scheme=schemes[n];
    let maxSize = Math.max(...scheme.map(c => c.pay.length));

    let unpaidCustomers = scheme.filter(c => 
        c.pay.length === maxSize && c.pay.some(v => v === undefined || v === null)
    );
    if(unpaidCustomers.length>0){
        res.status(200).json(unpaidCustomers);
    }else{
        res.json({"message":"No customers with pending balances"})
    }
})

//To add customer to a scheme

app.post("/schemes-post/:n",(req,res)=>{
    let n=req.params.n-1;
    let scheme=schemes[n];
    let newCust=req.body;
    scheme.push(newCust);
    res.status(200).json({
        "message":"Added successfully",
        "customers":scheme
    })
})

//To get schemes list

app.get("/schemes",(req,res)=>{
    if(schemes.length>0){
        res.status(200).json(schemes.map((_, index) => `scheme${index + 1}`));
    }else{
        res.status(404).json({
            "message":"No scheme found"
        })
    }
})

//To add scheme