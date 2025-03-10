"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowPhaseDetails(phaseId:string){
    const {userId} = auth();
    if(!userId){
        throw new Error("Unauthorized");
    }

    return prisma.executionPhase.findUnique({
        where:{
            id:phaseId,
            userId
        },
        include:{
            logs:{
                orderBy:{ 
                    timestamp: "asc"
                }
            }
        }
    })
}