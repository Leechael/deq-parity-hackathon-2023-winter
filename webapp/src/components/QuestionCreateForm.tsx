'use client';

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as R from 'ramda'
import {
  Card,
  CardBody,
  Typography,
  Input,
  Textarea,
  Button,
} from '@/components/material-tailwind'
import {
  usePublicClient,
  useWalletClient,
  useConnect,
  useAccount,
  useContractRead,
} from 'wagmi'
import { parseUnits, parseAbi } from 'viem'
import { getContract } from 'wagmi/actions'
import { InjectedConnector } from '@wagmi/connectors/injected'
import Homa from '@acala-network/contracts/build/contracts/Homa.json'
import { HOMA } from '@acala-network/contracts/utils/Predeploy'
import { LDOT } from '@acala-network/contracts/utils/MandalaTokens'
import Decimal from 'decimal.js'

import { trpcQuery } from '@/server/trpcProvider'
import { mandala } from '@/utils/chains'

const erc20_abis = [
  'function approve(address spender, uint256 value) external returns (bool)'
]

const quest_deposit_abis = [
  'function askQuestion(uint256 questionId, uint256 amount) public',
  'function answerQuestion(uint256 questionId, address answerer) public',
]

export function QuestionCreateForm() {
  const queryClient = useQueryClient()
  const { data: walletClient, isLoading: walletIsLoading } = useWalletClient()
  const { isConnected } = useAccount()
  const { connect } = useConnect({ connector: new InjectedConnector() })
  const publicClient = usePublicClient()
  const [loading, setLoading] = useState(false)
  const [dot, setDot] = useState('')

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [isConnected, connect])

  const { mutate, isLoading } = trpcQuery.questions.create.useMutation({
    onSuccess: (data) => {
      console.info(data)
      deposit(data.id)
      queryClient.invalidateQueries(['questions.lastest'])
    }
  })

  const { data: rate, isLoading: rateIsLoading } = useContractRead({
    address: HOMA,
    abi: Homa.abi,
    functionName: 'getExchangeRate',
  })

  const deposit = async (questionId: number) => {
    if (!walletClient) {
      return
    }
    if (!dot) {
      alert('Please price your offer')
      return
    }
    try {
      setLoading(true)
      console.info(dot, parseUnits(dot, 10))
      // stack
      const hash1 = await walletClient.writeContract({
        chain: mandala,
        address: HOMA,
        abi: Homa.abi,
        functionName: 'mint',
        args: [parseUnits(dot, 10)]
      })
      await publicClient.waitForTransactionReceipt({
        hash: hash1
      })
      console.info(`https://blockscout.mandala.aca-staging.network/tx/${hash1}`)

      const ldot = new Decimal(dot).div(Decimal.div((rate as bigint).toString(), parseUnits('1', 18).toString())).toString()

      const contractAddress = '0x8de7ecaaede7811725f7b9cce8c1f324a9100063'
      console.log('contractAddress:', contractAddress)

      // approve to transfer LDOT
      const hash2 = await walletClient.writeContract({
        chain: mandala,
        address: LDOT,
        abi: parseAbi(erc20_abis),
        functionName: 'approve',
        args: [contractAddress, parseUnits(ldot, 10)]
      })
      await publicClient.waitForTransactionReceipt({
        hash: hash2
      })
      console.info(`https://blockscout.mandala.aca-staging.network/tx/${hash2}`)

      // askQuestion
      const hash3 = await walletClient.writeContract({
        chain: mandala,
        address: contractAddress,
        abi: parseAbi(quest_deposit_abis),
        functionName: 'askQuestion',
        args: [14, parseUnits(ldot, 10)]
      })
      await publicClient.waitForTransactionReceipt({
        hash: hash3
      })
      console.info(`https://blockscout.mandala.aca-staging.network/tx/${hash3}`)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  const handleSubmit= async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({
      title: R.pathOr('', ['target', 'title', 'value'], e),
      body: R.pathOr('', ['target', 'body', 'value'], e),
      amount: BigInt(dot) * BigInt(1e18),
    })
  }

  return (
    <div className="w-[700px] m-x-auto">
      <Card>
        <CardBody>
          {isLoading && <div>Loading...</div>}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Typography variant="h6" color="blue-gray" className="">
                  Title
                </Typography>
                <Input
                  name="title"
                  size="lg"
                  label="Title"
                  required
                />
              </div>
              <Textarea
                name="body"
                size="lg"
                label="Details"
                required
              />
              <div className="flex flex-col gap-2">
                <Typography variant="h6" color="blue-gray" className="">
                  Price you offer
                </Typography>
                <Input
                  name="dot"
                  value={dot}
                  onChange={(e) => setDot(e.target.value)}
                  size="lg"
                  label="Min Price is 1 DOT"
                  required
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button loading={isLoading || walletIsLoading || loading} type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
