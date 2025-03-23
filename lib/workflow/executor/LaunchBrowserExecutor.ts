import { ExecutionEnvironment } from "@/types/executor";
const puppeteer = require("puppeteer");
// import  StealthPlugin from "puppeteer-extra-plugin-stealth";
import { LaunchBrowserTask } from "../task/LaunchBrowser";
import {exec} from "child_process";
import { waitFor } from "@/lib/helper/waitFor";
// import { executablePath } from "puppeteer";
 
// puppeteer.use(StealthPlugin());

export async function LaunchBrowserExecutor(environment:ExecutionEnvironment<typeof LaunchBrowserTask>):Promise<boolean>{
   try{
    const websiteUrl = environment.getInput("Website Url");
    // console.log(websiteUrl);
    const browser = await puppeteer.launch({
        headless:false,  // for testing 
        // executablePath:executablePath(),
    });
    environment.log.info("Browser Started Successfully");
    environment.setBrowser(browser);
    const page = await browser.newPage();
    page.setViewport({width:1080,height:1080});
    await page.goto(websiteUrl);
    environment.setPage(page);
    environment.log.info(`Opened page at :${websiteUrl}`);
    return true;
   }catch(error:any){
    environment.log.error(error.message);
    return false;
   }
}