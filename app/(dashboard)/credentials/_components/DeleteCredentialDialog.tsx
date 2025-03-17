"use client"

import { DeleteCredential } from '@/actions/credentials/deleteCredential';
import { DeleteWorkflow } from '@/actions/workflows/deleteWorkflows';
import { AlertTitle } from '@/components/ui/alert'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle ,AlertDialogDescription, AlertDialogAction} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialogTrigger } from '@radix-ui/react-alert-dialog';
import { useMutation } from '@tanstack/react-query';
import { XIcon } from 'lucide-react';
import React, { useState } from 'react'
import { toast } from 'sonner';

interface Props{
    name:string;
}
function DeleteCredentialDialog({name}:Props) {
    const [confirmText,setConfirmText]=useState("");
    const [open,setOpen] = useState(false);
    const deleteMutation = useMutation({
        mutationFn:DeleteCredential,
        onSuccess:()=>{
            toast.success("Credential deleted successfully",{id:name});
            setConfirmText("");
        },
        onError:(err)=>{
            toast.error("Something went wrong",{id:name});
        }
    })
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            <Button variant={"destructive"} size={"icon"}>
                <XIcon size={18}/>
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className=' text-muted-foreground'>
                    If you delete this Credential , you will  not be able to recover it.
                    <div className="flex flex-col py-4 gap-2">
                        <p>
                            If you are sure, enter <b>{name}</b> to confirm:
                        </p>
                        <Input value={confirmText} onChange={(e)=>setConfirmText(e.target.value)}/>
                    </div>
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={()=>setConfirmText("")}>Cancel</AlertDialogCancel>
                <AlertDialogAction disabled={confirmText!==name || deleteMutation.isPending} className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                onClick={(editor)=>{
                    toast.loading("Deleting workflow...",{id:name});
                    deleteMutation.mutate(name);
                }}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteCredentialDialog
