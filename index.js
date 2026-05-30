const fs = require("fs");
const http = require("http");
const url = require("url");

///////////////////////////////////////////////////
//files

//Blocking, synchronus way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This what we knwo about avacado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("well done.");

//Non-Blocking, Aysnchronouss way

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error!!!");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final2.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("your file has been writen.");
//       });
//     });
//   });
// });

////////////////////////////////////////////////////////
// SERVER
const replacedTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.discription);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8",
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8",
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8",
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  //Overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });
    const cardsHtml = dataObject
      .map((el) => replacedTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //Product Page
  } else if (pathName === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    res.end(tempProduct);

    //API
  } else if (pathName === "/api") {
    res.writeHead(200, { "content-type": "applicatin/json" });
    res.end(data);

    //404,Not Found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>404\npage not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("servere has been started in port 8000");
});
