

import { GetAvailableCredits } from '@/actions/workflows/getAvailableCredits'
import ReactCountUpWrapper from '@/components/ReactCountUpWrapper';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CoinsIcon } from 'lucide-react';
import React, { Suspense } from 'react'
import CreditsPurchase from './_components/CreditsPurchase';

export default function BillingPage() {
  return (
    <div className='mx-auto p-4 space-y-8'>
      <h1 className="text-3xl font-bold">Billing</h1>
      <Suspense fallback={<Skeleton className='h-[160px] w-full' />}>
        <BalanceCard />
      </Suspense>
      <CreditsPurchase />
    </div>
  )
}

async function BalanceCard() {
  const userBalance = await GetAvailableCredits();
  return (
    <Card className='bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg flex justify-between flex-col overflow-hidden'>
      <CardContent className='p-6 relative items-center'>
        <div className='flex justify-between items-center'>
          <div className="">
          <h3 className='text-lg font-semibold text-foreground mb-1'>Available Credits</h3>
          <p className='text-4xl font-bold text-primary'><ReactCountUpWrapper value={userBalance} /></p>
          </div>
          <CoinsIcon size={140} className='text-primary/20 absolute opacity-20 bottom-0 right-0'/>
        </div>
      </CardContent>
      <CardFooter className='text-muted-foreground'>
        When your credit balance reaches zero, your workflows will stop working.
      </CardFooter>
    </Card>
  )
}
