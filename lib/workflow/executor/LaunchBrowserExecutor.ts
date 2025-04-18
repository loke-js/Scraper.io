import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
import {exec} from "child_process";
import { waitFor } from "@/lib/helper/waitFor";
import * as cheerio from "cheerio";


const BROWSER_WS = "wss://brd-customer-hl_5319d92f-zone-scraping_browser1:pdz89yo1j5sb@brd.superproxy.io:9222";
  
const openDevtools = async (page:any, client:any) => {  
    // get current frameId  
    const frameId = page.mainFrame()._id;  
    // get URL for devtools from scraping browser  
    const { url: inspectUrl } = await client.send('Page.inspect', { frameId });  
    // open devtools URL in local chrome  
    exec(`start chrome "${inspectUrl}"`, error => {  
        if (error)  
            throw new Error('Unable to open devtools: ' + error);  
    });  
    // wait for devtools ui to load  
    await waitFor(5000);  
};  

export async function LaunchBrowserExecutor(environment:ExecutionEnvironment<typeof LaunchBrowserTask>):Promise<boolean>{
   try{
    const websiteUrl = environment.getInput("Website Url");
    // console.log(websiteUrl);
    const browser = await puppeteer.connect({
        browserWSEndpoint:BROWSER_WS,
    });
    environment.log.info("Browser Started Successfully");
    environment.setBrowser(browser);
    const page = await browser.newPage();
    page.setViewport({width:1920,height:1080});
    const client = await page.createCDPSession();
    await openDevtools(page,client);
    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info(`Opened page at :${websiteUrl}`);
    return true;
   }catch(error:any){
    environment.log.error(error.message);
    return false;
   }
}