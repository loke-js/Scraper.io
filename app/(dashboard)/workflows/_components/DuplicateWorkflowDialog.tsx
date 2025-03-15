"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { Dialog,DialogContent,DialogTrigger} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button';
import { CopyIcon, Layers2Icon, Loader2 } from 'lucide-react';
import CustomDialogHeader from '@/components/CustomDialogHeader';
import {  useForm } from 'react-hook-form';
import { duplicateWorkflowSchema, duplicateWorkflowSchemaType } from '@/schema/workflow';
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DuplicateWorkflow } from '@/actions/workflows/duplicateWorkflows';
import { cn } from '@/lib/utils';
function DuplicateWorkflowDialog({workflowId}:{workflowId?:string}) {
    const [open,setOpen] =useState(false);
    const form = useForm<duplicateWorkflowSchemaType>({
        resolver: zodResolver(duplicateWorkflowSchema),              
        defaultValues:{
            workflowId,
        }
    })
    const {mutate,isPending} = useMutation({
        mutationFn: DuplicateWorkflow,
        onSuccess:()=>{
            toast.success("Workflow duplicated",{id:"duplicate-workflow"});
            setOpen(false);
            form.reset();
        },
        onError:()=>{
            toast.error("Failed to duplicate",{id:"duplicate-workflow"});
        },
    }) 
    const onSubmit = useCallback((values:duplicateWorkflowSchemaType)=>{
        toast.loading("Duplicating workflow...",{id:"duplicate-workflow"});
        mutate(values);
    },[mutate]);
  return (
    <Dialog open={open} onOpenChange={(open)=>{
        setOpen(open);
        form.reset();
    }}>
        <DialogTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className={cn("ml-2 transition-opacity duration-200 opacity-0 group-hover/card:opacity-100")}>
            <CopyIcon className='w-4 h-4  text-muted-foreground cursor-pointer' />
            </Button>
        </DialogTrigger>
         <DialogContent className='px-0'>
            <CustomDialogHeader
                icon={Layers2Icon}
                title="Duplicate Workflow"
            />
          <div className="p-6">
            <Form {...form}>
                <form className='space-y-8 w-full' onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel className="flex gap-1 items-center">
                                    Name
                                    <p className="text-xs text-primary">(required)</p>
                                </FormLabel>
                                <FormControl>
                                    <Input {...field}/>
                                </FormControl>
                                <FormDescription>
                                    Choose a decriptive and unique name
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel className="flex gap-1 items-center">
                                    Description
                                    <p className="text-xs text-muted-foreground">(optional)</p>
                                </FormLabel>
                                <FormControl>
                                    <Textarea  {...field}/>
                                </FormControl>
                                <FormDescription>
                                    Provide a brief description of what your workflow does.
                                    <br/> This is optional but can help you remember the workflow purpose
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <Button type='submit' className='w-full' disabled={isPending}>
                          {!isPending && "Proceed"}
                          {isPending && <Loader2 className='animate-spin'/>}
                        </Button>
                </form>
            </Form>
           </div>
        </DialogContent> 
    </Dialog>
  )
}

export default DuplicateWorkflowDialog
