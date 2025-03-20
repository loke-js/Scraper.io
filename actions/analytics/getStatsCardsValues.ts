"use server"

import { PeriodToDateRange } from "@/lib/helper/dates";
import { prisma } from "@/lib/prisma";
import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server"

export async function GetStatsCardsValues(selectedPeriod: Period) {
    const { userId } = auth();
    if (!userId) {
        throw new Error("unauthenticated user");
    }
    const DateRange = PeriodToDateRange(selectedPeriod);
    const executions = await prisma.workflowExecution.findMany({
        where: {
            userId,
            startedAt: {
                gte: DateRange.startDate,
                lte: DateRange.endDate,
            }
        },
        select: {
            creditsConsumed: true,
            phases: {
                where: {
                    creditsConsumed: {
                        not: null,
                    }
                },
                select: { creditsConsumed: true },
            }
        },
    });

    const stats = {
        workflowExecutions: executions.length,
        creditsConsumed: executions.reduce((acc, execution) => acc + execution.creditsConsumed, 0),
        phases:  executions.reduce((acc, execution) => acc + execution.phases.length, 0),
    }
    return stats;
}

// "workflowExecutions": 109,  // 
//     "creditsConsumed": 763,
//     "phases": 299