const fs=require('fs')
const http=require('http')
const url=require('url')


const replaceTemplate=(temp,product)=>{
    let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName)
    output=output.replace(/{%IMAGE%}/g,product.image)
    output=output.replace(/{%PRICE%}/g,product.price)
    output=output.replace(/{%FROM%}/g,product.from)
    output=output.replace(/{%NUTRIENTS%}/g,product.nutrients)
    output=output.replace(/{%QUANTITY%}/g,product.quantity)
    output=output.replace(/{%DESCRIPTION%}/g,product.description)
    output=output.replace(/{%ID%}/g,product.id)

    if(!product.organic){
        output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic')
    }
    return output
 
}

const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8')
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8')
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8')

const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')
const DataObj=JSON.parse(data)

const server=http.createServer((req,res)=>{
    /* console.log(req.url)
    console.log(url.parse(req.url,true))
    const urlObj=url.parse(req.url,true)
    const pathname=req.url; */
    const {pathname,query}=url.parse(req.url,true)

    if(pathname=='/'|| pathname==='/overview'){
        res.writeHead(200,{'Content-Type':'text/html'})
        // el=element(it hold the data from dataObj/data.json )
        const cardsHtml=DataObj.map(el=>replaceTemplate(tempCard,el)).join('');
        const output=tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        // console.log(cardsHtml)


        res.end(output)
    }
    else if(pathname==='/product'){
        res.writeHead(200,{'Content-Type':'text/html'})
        const product=DataObj[query.id];
        const output=replaceTemplate(tempProduct,product);
        res.end(output);
        // console.log(query)
        // res.end("This is from product page")
        /* res.writeHead(200,{'Content-Type':'text/html'})
        const product=DataObj.find(el=>el.id==query.id)
        const output=replaceTemplate(tempProduct,product)
        res.end(output) */
    }
    else if(pathname==='/api'){
       /*  fs.readFile('./dev-data/data.json','utf-8',(err,data)=>{
            const productData=JSON.parse(data)
            res.writeHead(200,{
                'content-type':'application/json'
            })
            res.end(data)
        }) */
       res.writeHead(200,{'Content-Type':'application/json'})
       res.end(data)
    }
    else{
        res.end("The path not found")
    }

})

server.listen(8000,'127.0.0.1',()=>{
    console.log('Listening to the request on port 8000')
})