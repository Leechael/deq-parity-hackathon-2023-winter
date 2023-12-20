import { createPublicClient, http, defineChain, parseAbiItem } from 'viem'
import * as R from 'ramda'
import postgres from 'postgres'

const ANSWER_CONTRACT_ADDRESS = '0x3592D7BD047f069e17D708c31aa25d2c652323a2'

const mandala = defineChain({
  id: 595,
  name: 'Acala Mandala Testnet',
  network: 'acala',
  nativeCurrency: {
    decimals: 18,
    name: 'mACA',
    symbol: 'mACA',
  },
  rpcUrls: {
    default: {
      http: ['https://eth-rpc-tc9.aca-staging.network'],
    },
    public: {
      http: ['https://eth-rpc-tc9.aca-staging.network'],
    }
  }
})

const abis = [
  'event Created(uint256 indexed id, uint256 indexed questionId, address indexed creator, string uri)',
  'event Bought(uint256 indexed id, address indexed sender, uint256 amount, uint256 price, uint256 fee)',
  'event Sold(uint256 indexed id, address indexed sender, uint256 amount, uint256 price, uint256 fee)',
]

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

const sql = postgres(process.env.DATABASE_URL!);

//
//
//

const publicClient = createPublicClient({
  chain: mandala,
  transport: http(),
})

const created = await publicClient.getLogs({
  address: ANSWER_CONTRACT_ADDRESS,
  fromBlock: BigInt(1173150),
  event: parseAbiItem('event Created(uint256 indexed id, uint256 indexed questionId, address indexed creator, string uri)'),
})

const bought = await publicClient.getLogs({
  address: ANSWER_CONTRACT_ADDRESS,
  fromBlock: BigInt(1173150),
  event: parseAbiItem('event Bought(uint256 indexed id, address indexed sender, uint256 amount, uint256 price, uint256 fee)'),
})

const sold = await publicClient.getLogs({
  address: ANSWER_CONTRACT_ADDRESS,
  fromBlock: BigInt(1173150),
  event: parseAbiItem('event Sold(uint256 indexed id, address indexed sender, uint256 amount, uint256 price, uint256 fee)'),
})

console.log(`stats: created ${created.length}, bought ${bought.length}, sold ${sold.length}`)

//

const holders: [string, number, number][] = []

if (created.length > 0) {
  console.log('Processing CREATED events...')
  const created_exists = await sql` SELECT block_hash FROM trade_logs WHERE block_hash IN ${sql(R.uniq(created.map(log => log.blockHash)))} AND type = 'CREATED';`
  for (const log of created) {
    if (created_exists.find(exist => exist.block_hash === log.blockHash)) {
      console.log('skip', log.blockHash)
      continue
    }
    const { id, creator } = log.args
    await sql`
      INSERT INTO trade_logs (
        token_id, address, amount, tokens, creator_fee, block_hash, type
      )
      VALUES (${Number(id)}, ${creator as string}, ${1e18}, 0, 0, ${log.blockHash}, 'CREATED');
    `
    holders.push([creator!, 1e18, Number(id)])
    console.log('indexed', log.blockHash)
  }
}

if (bought.length > 0) {
  console.log('Processing BOUGHT events...')
  const bought_exists = await sql` SELECT block_hash FROM trade_logs WHERE block_hash IN ${sql(R.uniq(bought.map(log => log.blockHash)))} AND type = 'BOUGHT';`
  for (const log of bought) {
    if (bought_exists.find(exist => exist.block_hash === log.blockHash)) {
      console.log('skip', log.blockHash)  
      continue
    }
    const { id, sender, amount, price, fee } = log.args
    await sql`
      INSERT INTO trade_logs (
        token_id, address, amount, tokens, creator_fee, block_hash, type
      )
      VALUES (${Number(id)}, ${sender as string}, ${amount!.toString()}, ${price!.toString()}, ${fee!.toString()}, ${log.blockHash}, 'BOUGHT');
    `
    holders.push([sender!, Number(amount!), Number(id)])
    console.log('indexed', log.blockHash)
  }
}

if (sold.length > 0) {
  console.log('Processing SOLD events...')
  const sold_exists = await sql` SELECT block_hash FROM trade_logs WHERE block_hash IN ${sql(R.uniq(sold.map(log => log.blockHash)))} AND type = 'SOLD';`
  for (const log of sold) {
    if (sold_exists.find(exist => exist.block_hash === log.blockHash)) {
      console.log('skip', log.blockHash)
      continue
    }
    const { id, sender, amount, price, fee } = log.args
    await sql`
      INSERT INTO trade_logs (
        token_id, address, amount, tokens, creator_fee, block_hash, type
      )
      VALUES (${Number(id)}, ${sender as string}, ${amount!.toString()}, ${price!.toString()}, ${fee!.toString()}, ${log.blockHash}, 'SOLD');
    `
    holders.push([sender!, Number(amount!), Number(id)])
    console.log('indexed', log.blockHash)
  }
}

if (holders.length > 0) {
  console.log('Update holders...')
  const addresses = R.uniq(holders.map(holder => holder[0])) as string[]
  const holder_query = await sql`SELECT id, address FROM public.users WHERE address IN ${sql(addresses)} `
  const address_to_id = R.fromPairs(holder_query.map((holder: any) => [holder.address, holder.id]))

  console.log('found holders: ', addresses.length, 'found users: ', holder_query.length)

  for (const holder of holders) {
    const [address, amount, tokenId] = holder
    const user_id = address_to_id[address]
    if (!user_id) {
      console.log('skip with not matching user_id found: ', address)
      continue
    }
    await sql`
      INSERT INTO holders (token_id, shares, user_id) VALUES (${tokenId}, ${amount}, ${user_id})
      ON CONFLICT (token_id, user_id) DO UPDATE SET shares = holders.shares + ${amount};
    `
  }
}

console.log('Completed.')

process.exit(0)