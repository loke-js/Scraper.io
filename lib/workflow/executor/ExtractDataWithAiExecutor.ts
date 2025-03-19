import { ExecutionEnvironment } from "@/types/executor";
import { waitFor } from "@/lib/helper/waitFor";
import { ExtractDataWithAiTask } from "../task/ExtractDataWithAiTask";
import { prisma } from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import Groq from "groq-sdk";
export async function ExtractDataWithAiExecutor(environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>): Promise<boolean> {
    try {
        const credentials = environment.getInput("Credentials");
        if (!credentials) {
            environment.log.error("Input->credentials not defined");
        }
        const prompt = environment.getInput("Prompt");
        if (!prompt) {
            environment.log.error("Input->credentials not defined");
        }
        const content = environment.getInput("Content");
        if (!content) {
            environment.log.error("Input->content not defined");
        }
        // await waitFor(3000);
        // get credentials from db

        const credential = await prisma.credential.findUnique({
            where: {
                id: credentials,
            }
        })
        if (!credential) {
            environment.log.error("credential not found");
            return false;
        }
        const plainCredentialValue = symmetricDecrypt(credential.value);
        if (!plainCredentialValue) {
            environment.log.error("Cannot Decrypt Credential");
            return false;
        }
        const groq = new Groq({
            apiKey: plainCredentialValue,
        });
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract the data precisely based on the prompt. If no data is found, return an empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text",
                },
                {
                    role: "user",
                    content: content,
                },
                {
                    role: "user",
                    content: prompt,
                }
            ],
            model: "llama3-70b-8192",
            temperature: 1,

        });
        environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
        environment.log.info(`Completion tokens: ${response.usage?.completion_tokens}`);
        const result = response.choices[0].message.content;
        if(!result){
            environment.log.error("Empty response from AI");
            return false;
        }
        environment.setOutput("Extracted Data",result);
        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}