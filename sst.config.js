/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: 'discord-clone',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    }
  },
  async run() {
    // DynamoDB Table
    const table = new sst.aws.Dynamo('DiscordTable', {
      fields: {
        pk: 'string',
        sk: 'string',
        gsi1pk: 'string',
        gsi1sk: 'string',
      },
      primaryIndex: { hashKey: 'pk', rangeKey: 'sk' },
      globalIndexes: {
        gsi1: { hashKey: 'gsi1pk', rangeKey: 'gsi1sk' },
      },
      stream: 'new-and-old-images', // WebSocket broadcasting
    })
    // tRPC API via Function URL
    // TODO: replace with API Gateway
    const trpcApi = new sst.aws.Function('TrpcApi', {
      handler: 'packages/functions/src/trpc.handler',
      url: true,
      link: [table],
      environment: {
        TABLE_NAME: table.name,
      },
    })
    // Outputs
    return {
      api: trpcApi.url,
      tableName: table.name,
    }
  },
})
