const puppeteer = require('puppeteer')
const path = require('path')

const getResult = (req, res) => {
  const Minxiong = {city: '8', station: '1214'}
  const Tainan = {city: '9', station: '1228'}
  
  const time = req.body.time
  let from = req.body.from === '民雄' ? Minxiong : Tainan
  let to = from === Minxiong ? Tainan : Minxiong
  
  let url = 'http://twtraffic.tra.gov.tw/twrail/TW_Transfer.aspx'

  puppeteer.launch().then(async (browser) => {
    const page = await browser.newPage();
    try{
      await page.goto(url)
      await page.waitForSelector('#tabr1')
      const inputElement = await page.$('#tab3');
      await inputElement.click();
      await page.select('#FromCity3', from.city) 
      await page.select('#FromStation3', from.station)     
      const radio = await page.$('#lb_1')
      await radio.click()
      await page.select('#TransferCity', '8')
      await page.select('#TransferStation', '1215')
      await page.select('#ToCity3', to.city)
      await page.select('#ToStation3', to.station)
      console.log(time)
      await page.select('#FromTimeSelect3', time)
      await page.screenshot({path:'./test.jpg'})
      const search = await page.$('#searchbtn3')
      await search.click()
      await page.waitForSelector('#resultcontent thead')
      const elementBoundings = await page.evaluate(()=>{
        const element = document.querySelector('#resultcontent')
        element.style.overflow = 'visible'
        const {x, y, width} = element.getBoundingClientRect()
        const height = element.scrollHeight
        document.querySelector('#foot').style.display = 'none'
        return {x,y,width,height}
      })
      await page.screenshot({
        path: './result.jpg',
        clip: elementBoundings
      })
    } catch(e) {
      console.log(e)
    }
    await browser.close();
    res.sendFile(path.join(__dirname, './result.jpg'));
  });
}

module.exports = {
  getResult
}
