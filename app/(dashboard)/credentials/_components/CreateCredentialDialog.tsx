"use client"

import React, { useCallback, useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button';
import { Loader2, ShieldEllipsis } from 'lucide-react';
import CustomDialogHeader from '@/components/CustomDialogHeader';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCredentialSchema, createCredentialSchemaType } from '@/schema/credential';
import { CreateCredential } from '@/actions/credentials/createCredential';
function CreateCredentialDialog({ triggerText }: { triggerText?: string }) {
    const [open, setOpen] = useState(false);
    const form = useForm<createCredentialSchemaType>({
        resolver: zodResolver(createCredentialSchema),
        defaultValues: {}
    })
    const { mutate, isPending } = useMutation({
        mutationFn: CreateCredential,
        onSuccess: () => {
            toast.success("Credential created", { id: "create-credential" });
            setOpen(false);
            form.reset();
        },
        onError: () => {
            toast.error("Failed to create", { id: "create-credential" });
        },
    })
    const onSubmit = useCallback((values: createCredentialSchemaType) => {
        toast.loading("Creating credential...", { id: "create-credential" });
        mutate(values);
    }, [mutate]);
    return (
        <Dialog open={open} onOpenChange={(open) => {
            setOpen(open);
            form.reset();
        }}>
            <DialogTrigger asChild>
                <Button>{triggerText ? triggerText : "Create"}</Button>
            </DialogTrigger>
            <DialogContent className='px-0'>
                <CustomDialogHeader
                    icon={ShieldEllipsis}
                    title="Create Credential"
                />
                <div className="p-6">
                    <Form {...form}>
                        <form className='space-y-8 w-full' onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-1 items-center">
                                            Name
                                            <p className="text-xs text-primary">(required)</p>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter a unique and descriptive name for the credential.
                                            <br />
                                            This name will be used to identify the credential.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-1 items-center">
                                            Value
                                            <p className="text-xs text-primary">(required)</p>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea  {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the value associated with the credential <br />
                                            This value be securely encrypted and stored.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' className='w-full' disabled={isPending}>
                                {!isPending && "Proceed"}
                                {isPending && <Loader2 className='animate-spin' />}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCredentialDialog
