"use client"

import { UpdateWorkflowCron } from '@/actions/workflows/updateWorkflowCron'
import CustomDialogHeader from '@/components/CustomDialogHeader'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from '@tanstack/react-query'
import { CalendarIcon, ClockIcon, TriangleAlertIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import cronstrue from "cronstrue"
import parser from "cron-parser"
import { RemoveWorkflowSchedule } from '@/actions/workflows/removeWorkflowSchedule'
import { Separator } from '@/components/ui/separator'

export default function SchedulerDialog(props: { workflowId: string, cron: string | null }) {
    const [cron, setCron] = useState(props.cron || "");
    const [validCron, setValidCron] = useState(false);
    const [readableCron, setReadableCron] = useState("");
    const mutation = useMutation({
        mutationFn: UpdateWorkflowCron,
        onSuccess: () => {
            toast.success("Schedule updated successfully", { id: "cron" });
        },
        onError: () => {
            toast.error("Failed to update schedule", { id: "cron" });
        },
    })
    const removeScheduleMutation = useMutation({
        mutationFn: RemoveWorkflowSchedule,
        onSuccess: () => {
            toast.success("Schedule updated successfully", { id: "cron" });
        },
        onError: () => {
            toast.error("Failed to update schedule", { id: "cron" });
        },
    })
    useEffect(() => {
        try {
            parser.parse(cron)
            const humanCronStr = cronstrue.toString(cron);
            setValidCron(true);
            setReadableCron(humanCronStr);
        } catch (error) {
            setValidCron(false);
        }
    }, [cron])

    const workflowHasValidCron = props.cron && props.cron.length > 0;
    let readableSavedCron = workflowHasValidCron && cronstrue.toString(props.cron!);
    console.log(readableSavedCron);
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"link"} size={"sm"} className={cn("text-sm p-0 h-auto text-orange-500", workflowHasValidCron && "text-primary")}>
                    {workflowHasValidCron ? (<div className='flex items-center gap-2'>
                        <ClockIcon />
                        {readableSavedCron}
                    </div>) : (
                        <div className='flex items-center gap-1'>
                            <TriangleAlertIcon className='h-3 w-3  mr-1' /> Set Schedule
                        </div>
                    )
                    }
                </Button>
            </DialogTrigger>
            <DialogContent>
                <CustomDialogHeader title='Schedule workflow execution' icon={CalendarIcon} />
                <div className="p-6 space-y-4 ">
                    <p className="text-muted-foreground text-sm">Specify a cron expression to schedule periodic workflow execution.All times are in UTC</p>
                    <Input placeholder='E.g. * * * *' value={cron} onChange={e => setCron(e.target.value)} />
                    <div className={cn("bg-accent rounded-md p-4 border text-sm border-destructive text-destructive", validCron && "border-primary text-primary")}>{validCron ? readableCron : "Not a valid cron expression"}</div>
                    {workflowHasValidCron && (
                        <DialogClose asChild>
                            <div className="px-8">
                        <Button className='w-full border-destructive text-destructive hover:text-destructive' variant={"outline"} onClick={() => {
                            toast.loading("Removing Schedule...",{id:"cron"});
                            removeScheduleMutation.mutate({ id: props.workflowId })
                        }}>
                            Remove current schedule
                        </Button>
                        <Separator className='my-4'/>
                        </div>
                    </DialogClose>
                    
                    )}
                </div>
                <DialogFooter className='px-6 gap-2'>
                    <DialogClose asChild>
                        <Button className='w-full' variant={"secondary"} >
                            Cancel
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button className='w-full'
                            onClick={() => {
                                toast.loading("Saving...", { id: "cron" });
                                mutation.mutate({
                                    id: props.workflowId,
                                    cron,
                                })
                            }}
                            disabled={mutation.isPending || !validCron}
                        >Save</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

