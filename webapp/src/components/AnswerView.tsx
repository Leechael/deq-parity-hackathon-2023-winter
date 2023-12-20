'use client';

import { useEffect, useState } from 'react'
import { trpcQuery } from '@/server/trpcProvider'
import { atom, useAtom, useSetAtom } from 'jotai'
import {
  Avatar,
  Card,
  CardBody,
  Typography,
  Spinner,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Button,
  ButtonGroup,
  Dialog,
  DialogBody,
  DialogHeader,
  DialogFooter,
  Input,
} from '@material-tailwind/react'
import { formatEther, parseAbi, parseEther } from 'viem'
import { polygonMumbai } from 'viem/chains'
import { usePublicClient, useAccount, useConnect, useWalletClient, useContractWrite, usePrepareContractWrite, useNetwork, useSwitchNetwork } from 'wagmi'
import { InjectedConnector } from '@wagmi/connectors/injected'
import { getBuyPrice, getSellPrice, type EstimatedPrice, ANSWER_CONTRACT_ADDRESS, abis } from '@/features/answers/requests'
import { mandala } from '@/utils/chains'
import { buyAnswerIdAtom, sellAnswerIdAtom } from './atoms';


export function AnswerView({ id }: { id: number }) {
  const { data, isLoading } = trpcQuery.answers.getById.useQuery({ id })
  const setBuyAnswerId = useSetAtom(buyAnswerIdAtom)
  const setSellAnswerId = useSetAtom(sellAnswerIdAtom)
  return (
    <Card className='w-full'>
      <CardBody>
        {isLoading ? <Spinner className="mx-auto" /> : null}
        {data ? (
          <div className="flex flex-col gap-4">
            <Typography variant="h2">{data.question.title}</Typography>
            <div className="flex flex-row gap-1 items-center">
              <Avatar
                src="https://docs.material-tailwind.com/img/face-2.jpg"
                alt="avatar"
                className="p-0.5"
                size="sm"
              />
              <div>
                <Typography color="gray" className="font-medium">@{data.user.handle}</Typography>
              </div>
            </div>
            <Typography className="leading-7">
              {data.body}
            </Typography>
          </div>
        ) : null}
        <div className="mt-4 border-t border-gray pt-2 flex flex-row justify-between">
          <div />
          <ButtonGroup variant="gradient" color="amber">
            <Button onClick={() => setBuyAnswerId(id)}>Buy</Button>
            <Button onClick={() => setSellAnswerId(id)}>Sell</Button>
          </ButtonGroup>
        </div>
      </CardBody>
    </Card>
  )
}

export function AnswerData({ id }: { id: number }) {
  return (
    <Card className='w-full'>
      <Tabs value="trades">
        <TabsHeader>
          <Tab value="trades">Recent Trades</Tab>
          <Tab value="holders">Holders</Tab>
          <Tab value="overview">Overview</Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel value="trades">
            Trades
          </TabPanel>
          <TabPanel value="holders">
            Holders
          </TabPanel>
          <TabPanel value="overview">
            overview
          </TabPanel>
        </TabsBody>
      </Tabs>
    </Card>
  )
}
