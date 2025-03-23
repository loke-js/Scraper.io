"use client"

import { GetWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Layers2 } from 'lucide-react'
import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

const chartConfig = {
  success: {
    label: "Success",
    color: "hsl(var(--chart-b))",
  },
  failed: {
    label: "Failed",
    color: "hsl(var(--chart-a))",
  }
}
type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>
export default function ExecutionStatusChart({ data }: { data: ChartData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-bold flex items-center gap-2'>
          <Layers2 className='w-6 h-6 text-primary' />
          Workflow Execution Status
        </CardTitle>
        <CardDescription>
          Daily number of successfull and failed workflow executions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='max-h-[200px] w-full'>
          <AreaChart data={data} height={200} accessibilityLayer margin={{ top: 20 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey={"date"} tickLine={false} axisLine={false}
              minTickGap={32}
              tickFormatter={value => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ChartTooltip content={<ChartTooltipContent className='w-[250px]' />} />
            <Area
              min={0}
              type={'bump'}
              fill='var(--color-success)'
              fillOpacity={0.6}
              stroke='var(--color-success)'
              dataKey={"success"}
              stackId={"a"}
              />
            <Area
              min={0}
              type={'bump'}
              fill='var(--color-failed)'
              fillOpacity={0.6}
              stroke='var(--color-failed)'
              dataKey={"failed"}
              stackId={"a"}
              />
            
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
