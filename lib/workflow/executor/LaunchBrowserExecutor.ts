import { ExecutionEnvironment } from "@/types/executor";
import puppeteer from "puppeteer-core";
import { LaunchBrowserTask } from "../task/LaunchBrowser";

const BROWSER_WS = "wss://production-sfo.browserless.io?token=2TRz5dsbx4otgyc9656931d4e3fbe01862ce4dd273e3f8b70";

export async function LaunchBrowserExecutor(environment:ExecutionEnvironment<typeof LaunchBrowserTask>):Promise<boolean>{
   try{
    const websiteUrl = environment.getInput("Website Url");
    // console.log(websiteUrl);
    const browser = await puppeteer.connect({
        browserWSEndpoint:BROWSER_WS,
        // headless:true,
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