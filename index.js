const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require("slugify");

const replacedTemplate = require("./modules/replacedTemplate.js");

// SERVER
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

dataObject.forEach((product) => {
  product.slug = slugify(product.productName, { lower: true });
});

const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "content-type": "text/html" });
    const cardsHtml = dataObject
      .map((el) => replacedTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    const product = dataObject.find((el) => el.slug === query.slug);

    const output = replacedTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === "/api") {
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
