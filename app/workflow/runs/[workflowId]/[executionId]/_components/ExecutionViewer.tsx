"use client"

import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionPhases"
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { cn } from "@/lib/utils";
import { Log, LogLevel } from "@/types/log";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { ExecutionLog } from "@prisma/client";
import { Value } from "@radix-ui/react-select";
import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, CircleDashedIcon, ClockIcon, CoinsIcon, Loader2Icon, LucideIcon, WorkflowIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import PhaseStatusBadge from "./PhaseStatusBadge";
import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import WorkflowStatusBadge from "./WorkflowStatusBadge";


type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>

function ExecutionViewer({ initialData }: { initialData: ExecutionData }) {
    const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

    const query = useQuery({
        queryKey: ["execution", initialData?.id],
        initialData,
        queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
        refetchInterval: ((q) => q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false),
    });
    const phaseDetails = useQuery({
        queryKey: ["phaseDetails", selectedPhase,query.data?.status],
        enabled: selectedPhase !== null,
        queryFn: () => GetWorkflowPhaseDetails(selectedPhase!)
    })
    const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING
    useEffect(()=>{
        // while running we auto-select the current running phase in sidebar
        const phases = query.data?.phases || [];
        if(isRunning){
            const phaseToSelect = phases.toSorted((a,b)=>a.startedAt!>b.startedAt! ? -1:1)[0];
            setSelectedPhase(phaseToSelect.id);
            return;
        }
        const phaseToSelect = phases.toSorted((a,b)=>a.completedAt!>b.completedAt! ? -1:1)[0];
        setSelectedPhase(phaseToSelect.id);
    },[query.data?.phases,isRunning,setSelectedPhase]);
      
    const duration = DatesToDurationString(
        query.data?.startedAt,
        query.data?.completedAt
    )
    const creditsConsumed = GetPhasesTotalCost(query.data?.phases || []);
    return (
        <div className="flex w-full h-full">
            <aside className="w-[440px] min-w-[440px] max-w-[440px] border-2 border-separate  flex flex-grow flex-col ">
                <div className="py-4 px-2 ">
                    <ExecutionLabel icon={CircleDashedIcon} label="Status" value={<div className="font-semibold capitalize flex gap-2 items-center">
                        <WorkflowStatusBadge status={query.data?.status as WorkflowExecutionStatus}/>
                        <span className="">{query.data?.status}</span>
                    </div>}/>
                    <ExecutionLabel icon={CalendarIcon} label="Started at" value={
                        <span className="lowercase ">
                            {query.data?.startedAt ? formatDistanceToNow(new Date(query.data?.startedAt), {
                                addSuffix: true,
                            }) : "-"}
                        </span>
                    }
                    />
                    <ExecutionLabel icon={ClockIcon} label="Duration" value={duration ? duration : <Loader2Icon className="stroke-muted-foreground animate-spin" />} />
                    <ExecutionLabel icon={CoinsIcon} label="Credits consumed" value={<ReactCountUpWrapper value={creditsConsumed}/>} />
                </div>
                <Separator />
                <div className="flex justify-center items-center py-2 px-4">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
                        <span className="font-semibold">Phases</span>
                    </div>
                </div>
                <Separator />
                <div className="overflow-auto h-full px-2 py-4">
                    {query.data?.phases.map((phase, index) => (
                        <Button key={phase.id} className="w-full flex justify-between"
                            variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                            onClick={() => {
                                if (isRunning) return
                                setSelectedPhase(phase.id);
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <Badge variant={"outline"}>
                                    {index + 1}
                                </Badge>
                                <p className="font-semibold">{phase.name}</p>
                            </div>
                           <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus}/>
                        </Button>
                    ))}
                </div>
            </aside>
            <div className="flex w-full h-full">
                {isRunning && (
                    <div className="flex items-center flex-col gap-2 justify-center w-full h-full">
                        <p className="font-bold text-centers">Running is in progress,please wait</p>
                    </div>
                )}
                {
                    !isRunning && !selectedPhase && (
                        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
                            <div className="flex flex-col gap-1 text-center">
                                <p className="font-bold">No phase selected</p>
                                <p className="text-sm text-muted-foreground">
                                    Select a phase to view details
                                </p>
                            </div>
                        </div>
                    )
                }

                {
                    !isRunning && selectedPhase && phaseDetails.data && (
                        <div className="flex flex-col py-4 container  gap-4  overflow-auto">
                            <div className="flex gap-2 items-center">
                                <Badge variant={'outline'} className="space-x-4">
                                    <div className="flex gap-2 items-center">
                                    <CoinsIcon size={18} className="stroke-muted-foreground" />
                                    <span>
                                        Credits
                                    </span>
                                    </div> 
                                    <span>
                                        {phaseDetails.data.creditsConsumed}
                                    </span>
                                </Badge>
                                <Badge variant={'outline'} className="space-x-4">
                                    <div className="flex gap-1 items-center">
                                    <ClockIcon size={18} className="stroke-muted-foreground" />
                                    <span>
                                        Duration
                                    </span>
                                    </div>
                                    <span>
                                        {DatesToDurationString(phaseDetails.data.startedAt,phaseDetails.data.completedAt) || "-"}
                                    </span>
                                </Badge>
                            </div>
                            <ParamaterViewer title="Inputs" subtitle="Inputs used for this phase" paramsJSON={phaseDetails.data.inputs}/>
                            <ParamaterViewer title="Outputs" subtitle="Outputs of this phase" paramsJSON={phaseDetails.data.outputs}/>
                            <LogViewer logs = {phaseDetails.data.logs}/>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

function ExecutionLabel({ icon, label, value }: { icon: LucideIcon, label: ReactNode, value: ReactNode }) {
    const Icon = icon;
    return (
        <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
                <Icon size={20} className="stroke-muted-foreground/80"/>
                <span>{label}</span>
            </div>
            <div className="font-semibold capitalize flex gap2 items-center">
                {value}
            </div>
        </div>
    )
}

function ParamaterViewer({title,subtitle,paramsJSON}:{title:string,subtitle:string,paramsJSON:string|null}){
    const params = paramsJSON ? JSON.parse(paramsJSON):undefined;
    return (
        <Card >
            <CardHeader className="rounded-lg rounded-b-none border-b py-4  bg-gray-50 dark:bg-background">
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                    {subtitle}
                </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
                <div className="flex flex-col  gap-2 ">
                    {!params || Object.keys(params).length===0 &&(
                      <p className="text-sm">No parameters generated by this phase</p>
                    )}
                    {
                        params && Object.entries(params).map(([Key,Value])=>(
                            <div key={Key}  className="flex justify-between items-center space-y-1">
                                <p className="text-sm text-muted-foreground flex-1 basis-1/3">
                                {Key}</p>
                                <Input readOnly className="flex-1 basis-2/3" value={Value as string}  />
                            </div>
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    )
}

function LogViewer({logs}:{logs:ExecutionLog[] | undefined}){
    if(!logs || logs.length===0 ) return null;
    return (
        <Card className="w-full">
             <CardHeader className="rounded-lg rounded-b-none border-b py-4  bg-gray-50 dark:bg-background">
                <CardTitle className="text-base">Logs</CardTitle>
                <CardDescription className="text-muted-foreground text-sm">
                   Logs generated by this phase
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="text-muted-foreground text-sm">
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Message</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log)=>(
                            <TableRow key={log.id} className="">
                                <TableCell width={190} className="text-xs text-muted-foreground p-[2px] pl-4">{log.timestamp.toISOString()}</TableCell>
                                <TableCell width={80} className={cn("uppercase font-bold text-xs p-[3px] pl-4 ",
                                    log.logLevel as LogLevel === "error" && "text-destructive",
                                    log.logLevel as LogLevel === "info" && "text-primary"

                        )}>{log.logLevel}</TableCell>
                                <TableCell className="text-xs flex-1 p-[3px] pl-4 ">{log.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
export default ExecutionViewer
