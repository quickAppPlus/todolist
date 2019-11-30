const fs = require("fs");
const path = require("path");
const https = require("https");
const data = require("../output/datas.json");

for (let i = 0; i < data.length; i++) {
  data[i].index = i;
  const req = https.request(data[i].img, async res => {
    res.pipe(
      fs.createWriteStream(
        // path.resolve(path.basename(data[i].img))
        path.resolve(__dirname, "../public/images/" + i + ".webp")
      )
    );
    // await new Promise(resolve => {
    //   setTimeout(resolve, 30);
    // });
  });
  req.end();
}
