const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");
const https = require("https");

const options = {
  headless: false,
  timeout: 0,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
  ignoreHTTPSErrors: true,
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  defaultViewport: null
};

let f = length => [...Array.from({ length }).keys()];

async function getVideoInfo(page, url) {
  await page.goto(url);
  await page.waitForSelector(".vd-list-cnt ul li .v-info span:nth-child(1)");
  const texts = await page.$$eval(
    ".vd-list-cnt ul li .v-info span:nth-child(1)",
    spans => {
      return [].slice.call(spans, 0).map(span => span.textContent);
    }
  );
  const counts = texts.map(text => parseFloat(text));
  const titles = await page.$$eval("#videolist_box .l-item .title", as => {
    return [].slice.call(as, 0).map(a => a.textContent);
  });
  const hrefs = await page.$$eval("#videolist_box .l-item .title", as => {
    return [].slice.call(as, 0).map(a => a.href);
  });

  await page.evaluate(async () => {
    /* 这里做的是渐进滚动，如果一次性滚动则不会触发获取新数据的监听 */
    for (var y = 0; y <= 2000; y += 200) {
      window.scrollTo(0, y);
      await new Promise(resolve => {
        setTimeout(resolve, 100);
      });
    }
  });

  const imgs = await page.$$eval(
    "#videolist_box .l-item .pic .lazy-img img",
    imgs => {
      return [].slice.call(imgs, 0).map(img => img.src);
    }
  );
  const videos = f(20).map(n => {
    return {
      title: titles[n],
      href: hrefs[n],
      img: imgs[n],
      count: counts[n]
    };
  });
  return videos;
}

var browser;
var page;
async function launchBrowser() {
  browser = await puppeteer.launch(options);
  page = await browser.newPage();
  return { browser, page };
}

const formatData = d => {
  const y = d.getFullYear();
  const m =
    d.getMonth() + 1 >= 10 ? d.getMonth() + 1 : "0" + (d.getMonth() + 1);
  const day = d.getDate() + 1 > 10 ? d.getDate() : "0" + d.getDate();
  const result = y + "-" + m + "-" + day;
  return result;
};

function getUrl(year, month) {
  let lastDay = formatData(new Date(new Date(year, month, 0)));
  const today = formatData(new Date());
  new Date(lastDay).getTime() > new Date(today).getTime()
    ? (lastDay = today)
    : "";

  const base =
    "https://www.bilibili.com/v/digital/mobile/?spm_id_from=333.6.b_7072696d6172795f6d656e75.58#/all/click/0/1/";
  month = month >= 10 ? "" + month : "0" + month;
  let url = base + year + "-" + month + "-" + "01" + "," + lastDay;
  return url;
}

Object.defineProperty(Array.prototype, "flat", {
  value: function(depth = 1) {
    return this.reduce(function(flat, toFlatten) {
      return flat.concat(
        Array.isArray(toFlatten) && depth > 1
          ? toFlatten.flat(depth - 1)
          : toFlatten
      );
    }, []);
  }
});

launchBrowser().then(async launcher => {
  let page = launcher.page;
  let browser = launcher.browser;
  let data = [];
  // 爬数据
  for (let y = 2014; y < 2020; y++) {
    for (let month = 1; month <= 12; month++) {
      let lastDay = formatData(new Date(new Date(y + "", month - 1, 0)));
      const today = formatData(new Date());
      if (new Date(lastDay).getTime() > new Date(today).getTime()) break;
      const result = await getVideoInfo(page, getUrl(y + "", month));
      data.push(result);
    }
  }
  // 数据排序
  data = data.flat(Infinity);
  data = data.sort((m, n) => {
    return n.count - m.count;
  });
  // 下载图片
  for (let i = 0; i < data.length; i++) {
    data[i].index = i;
    const req = https.request(data[i].src, async res => {
      res.pipe(
        fs.createWriteStream(
          path.resolve(__dirname, "../assets/images/" + i + ".webp")
        )
      );
      await new Promise(resolve => {
        setTimeout(resolve, 30);
      });
    });
  }
  // 数据持久化
  fs.mkdir("output", function(err) {
    fs.writeFile(
      "public/datas.json",
      JSON.stringify(data, null, 2),
      async function(err) {
        if (err) {
          console.log("写入失败", err);
        } else {
          console.log("写入成功");
        }
        await page.waitFor(2000);
        await browser.close();
      }
    );
  });
});
