import { appRouter, createContext } from '@discord-clone/core'
import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda'
export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext,
  responseMeta() {
    return {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  },
})
