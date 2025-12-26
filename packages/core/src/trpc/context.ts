import type { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda'

export const createContext = async (
  // TODO: Fix this
  opts: CreateAWSLambdaContextOptions<any>
) => {
  return {
    // TODO: add: dynamoDb client, user auth, etc
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>
