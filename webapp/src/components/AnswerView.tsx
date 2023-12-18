'use client';

import { useState } from 'react'
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

const buyConfirmDialogVisibleAtom = atom(false)
const sellConfirmDialogVisibleAtom = atom(false)

export function BuyConfirmDialog({ id }: { id: number }) {
  const [isEstimating, setIsEstimating] = useState(false)
  const [amount, setAmount] = useState(0)
  const [price, setPrice] = useState<EstimatedPrice | null>(null)

  const [visible, setVisible] = useAtom(buyConfirmDialogVisibleAtom)
  const publicClient = usePublicClient()
  const { connect } = useConnect({ connector: new InjectedConnector() })
  const { isConnected } = useAccount()

  const { chain } = useNetwork()
  // const { switchNetwork } = useSwitchNetwork({ chainId: polygonMumbai.id })
  // const needSwitchChain = chain?.id !== polygonMumbai.id
  const { switchNetwork } = useSwitchNetwork({ chainId: mandala.id })
  const needSwitchChain = chain?.id !== mandala.id

  const { config } = usePrepareContractWrite({
    address: ANSWER_CONTRACT_ADDRESS,
    abi: parseAbi(abis),
    functionName: 'buy',
    args: [BigInt(id), BigInt(amount * 10000) * BigInt(1e14)],
    value: price?.priceWithFee,
    // value: BigInt(1e17),
    enabled: !!(amount && amount > 0 && price && price.priceWithFee > 0 && isConnected),
  })
  const { isLoading, write, } = useContractWrite({
    ...config,
    onSuccess: () => setVisible(false),
  })

  return (
    <Dialog open={visible} handler={() => setVisible(i => !i)}>
      <DialogHeader>
        <Typography variant="h5">Buy Shares</Typography>
      </DialogHeader>
      <DialogBody>
        {isEstimating ? (<Spinner />) : (
          price ? (
            <Typography className="text-2xl text-red-400 font-medium">
              {formatEther(price.price)} <small>ACA</small>
            </Typography>
          ) : null
        )}
        <Typography className="mb-4">
          Price rises as more shares are bought.
        </Typography>
        <div className="relative flex w-full">
          <Input
            label="Shares"
            className="pr-20"
            containerProps={{
              className: "min-w-0",
            }}
            onChange={e => {
              const parsed = Number(e.target.value)
              if (parsed && parsed > 0 && !isNaN(parsed)) {
                setAmount(parsed)
                setIsEstimating(true)
                getBuyPrice(publicClient, BigInt(id), BigInt(parsed * 10000) * BigInt(1e14)).then(price => {
                  setPrice(price)
                  setIsEstimating(false)
                })
              }
            }}
          />
          <Button
            size="sm"
            color="gray"
            disabled={true}
            className="!absolute right-1 top-1 rounded"
          >
            Shares
          </Button>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={() => setVisible(i => !i)}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        {!isConnected ? (
          <Button
            variant="gradient"
            color="amber"
            onClick={() => connect()}
          >
            <span>Connect</span>
          </Button>
        ) : null}
        {(isConnected && needSwitchChain) ? (
          <Button
            variant="gradient"
            color="amber"
            onClick={() => {
              switchNetwork?.()
            }}
          >
            <span>Switch Network</span>
          </Button>
        ) : null}
        <Button
          variant="gradient"
          color="amber"
          loading={isLoading}
          disabled={isEstimating || !amount || !isConnected}
          onClick={() => write?.()}
        >
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export function SellConfirmDialog({ id }: { id: number }) {
  const [isEstimating, setIsEstimating] = useState(false)
  const [amount, setAmount] = useState(0)
  const [price, setPrice] = useState<EstimatedPrice | null>(null)

  const [visible, setVisible] = useAtom(sellConfirmDialogVisibleAtom)
  const publicClient = usePublicClient()
  const { connect } = useConnect({ connector: new InjectedConnector() })
  const { isConnected } = useAccount()

  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork({ chainId: mandala.id })
  // const { switchNetwork } = useSwitchNetwork({ chainId: polygonMumbai.id })
  const needSwitchChain = chain?.id !== polygonMumbai.id

  const { config } = usePrepareContractWrite({
    address: ANSWER_CONTRACT_ADDRESS,
    abi: parseAbi(abis),
    functionName: 'sell',
    args: [BigInt(id), BigInt(amount * 10000) * BigInt(1e14)],
    enabled: !!(amount && amount > 0 && isConnected),
  })
  const { isLoading, write, } = useContractWrite({
    ...config,
    onSuccess: () => setVisible(false),
  })

  return (
    <Dialog open={visible} handler={() => setVisible(i => !i)}>
      <DialogHeader>
        <Typography variant="h5">Sell Shares</Typography>
      </DialogHeader>
      <DialogBody>
        {isEstimating ? (<Spinner />) : (
          price ? (
            <Typography className="text-2xl text-red-400 font-medium">
              {formatEther(price.price)} <small>ACA</small>
            </Typography>
          ) : null
        )}
        <Typography className="mb-4">
          Price rises as more shares are bought.
        </Typography>
        <div className="relative flex w-full">
          <Input
            label="Shares"
            className="pr-20"
            containerProps={{
              className: "min-w-0",
            }}
            onChange={e => {
              const parsed = Number(e.target.value)
              if (parsed && parsed > 0 && !isNaN(parsed)) {
                setAmount(parsed)
                setIsEstimating(true)
                getSellPrice(publicClient, BigInt(id), BigInt(parsed * 10000) * BigInt(1e14)).then(price => {
                  setPrice(price)
                  setIsEstimating(false)
                })
              }
            }}
          />
          <Button
            size="sm"
            color="gray"
            disabled={true}
            className="!absolute right-1 top-1 rounded"
          >
            Shares
          </Button>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={() => setVisible(i => !i)}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        {!isConnected ? (
          <Button
            variant="gradient"
            color="amber"
            onClick={() => connect()}
          >
            <span>Connect</span>
          </Button>
        ) : null}
        {(isConnected && needSwitchChain) ? (
          <Button
            variant="gradient"
            color="amber"
            onClick={() => {
              switchNetwork?.()
            }}
          >
            <span>Switch Network</span>
          </Button>
        ) : null}
        <Button
          variant="gradient"
          color="amber"
          loading={isLoading}
          disabled={isEstimating || !amount || !isConnected}
          onClick={() => write?.()}
        >
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  )
}

export function AnswerView({ id }: { id: number }) {
  const { data, isLoading } = trpcQuery.answers.get.useQuery({ id })
  const setBuyConfirmDialogVisible = useSetAtom(buyConfirmDialogVisibleAtom)
  const setSellConfirmDialogVisible = useSetAtom(sellConfirmDialogVisibleAtom)
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
            <Button onClick={() => setBuyConfirmDialogVisible(true)}>Buy</Button>
            <Button onClick={() => setSellConfirmDialogVisible(true)}>Sell</Button>
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
