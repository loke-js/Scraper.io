import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";



const BROWSER_WS = "wss://brd-customer-hl_5319d92f-zone-scraping_browser1:pdz89yo1j5sb@brd.superproxy.io:9222";
  


export async function LaunchBrowserExecutor(environment:ExecutionEnvironment<typeof LaunchBrowserTask>):Promise<boolean>{
   try{
    const websiteUrl = environment.getInput("Website Url");
    // console.log(websiteUrl);
    const browser = await puppeteer.launch({
        browserWSEndpoint:BROWSER_WS,
        headless:true,
    });
    environment.log.info("Browser Started Successfully");
    environment.setBrowser(browser);
    const page = await browser.newPage();
    page.setViewport({width:1080,height:1024});
    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info(`Opened page at :${websiteUrl}`);
    return true;
   }catch(error:any){
    environment.log.error(error.message);
    return false;
   }
}