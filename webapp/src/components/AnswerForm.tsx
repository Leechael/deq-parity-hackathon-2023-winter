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
  useNetwork,
  useSwitchNetwork,
  usePrepareContractWrite,
  useContractWrite,
} from 'wagmi'
import { parseUnits, parseAbi } from 'viem'
import { useAtom, atom } from 'jotai'
import { getContract } from 'wagmi/actions'
import { InjectedConnector } from '@wagmi/connectors/injected'
import { type EstimatedPrice, ANSWER_CONTRACT_ADDRESS, abis } from '@/features/answers/requests'

import { trpcQuery } from '@/server/trpcProvider'
import { mandala } from '@/utils/chains'

const erc20_abis = [
  'function approve(address spender, uint256 value) external returns (bool)'
]

const quest_deposit_abis = [
  'function askQuestion(uint256 questionId, uint256 amount) public',
  'function answerQuestion(uint256 questionId, address answerer) public',
]

export function AnswerForm({ questionId }: { questionId: number }) {
  const { mutate, isLoading } = trpcQuery.answers.create.useMutation()

  const { data: walletClient, isLoading: walletIsLoading } = useWalletClient()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({ connector: new InjectedConnector() })

  useEffect(() => {
    if (!isConnected) {
      connect()
    }
  }, [isConnected, connect])

  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork({ chainId: mandala.id })
  const needSwitchChain = chain?.id !== mandala.id

  const { data: nextId } = useContractRead({
    address: ANSWER_CONTRACT_ADDRESS,
    abi: parseAbi(quest_deposit_abis),
    functionName: 'nextId',
  })

  const { config } = usePrepareContractWrite({
    address: ANSWER_CONTRACT_ADDRESS,
    abi: parseAbi(abis),
    functionName: 'create',
    args: [address!, BigInt(questionId), ''],
    enabled: !!address,
  })
  const { isLoading: isSubmitting, write, } = useContractWrite(config)

  const handleSubmit= async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate({ questionId, tokenId: nextId as number, body: R.pathOr('', ['target', 'body', 'value'], e) })
  }

  return (
    <div className="w-[700px] m-x-auto">
      <Card>
        <CardBody>
          {isLoading && <div>Loading...</div>}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <Textarea
                name="body"
                size="lg"
                label="Details"
              />
              <div className="flex justify-end mt-4">
                <Button loading={isLoading || walletIsLoading || isSubmitting} type="submit">Submit</Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
