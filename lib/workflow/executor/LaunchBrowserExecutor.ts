import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
import {exec} from "child_process";
import { waitFor } from "@/lib/helper/waitFor";
const BROWSER_WS = "wss://brd-customer-hl_6c5b0de2-zone-scraper_io_browser:i4hvdfa5grjj@brd.superproxy.io:9222";

const openDevtools = async (page:any, client:any) => {  
    // get current frameId  
    const frameId = page.mainFrame()._id;  
    // get URL for devtools from scraping browser  
    const { url: inspectUrl } = await client.send('Page.inspect', { frameId });  
    // open devtools URL in local chrome  
    exec(`start chrome "${inspectUrl}"`, (error) => {  
        if (error)throw new Error('Unable to open devtools: ' + error);  
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
    })
    environment.log.info("Browser Started Successfully");
    environment.setBrowser(browser);
    const page = await browser.newPage();
    page.setViewport({width:1080,height:1080});
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