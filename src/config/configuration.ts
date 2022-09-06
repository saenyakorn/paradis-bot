export interface IConfiguration {
  app: {
    port: number
    globalPrefix: string
  }
  database: {
    host: string
    port: number
    username: string
    password: string
  }
  discord: {
    token: string
    clientId: string
    clientSecret: string
  }
}

export const configuration = () => {
  const env: IConfiguration = {
    app: {
      port: parseInt(process.env.APP_PORT, 10) || 3000,
      globalPrefix: process.env.APP_GLOBAL_PREFIX ?? 'api',
    },
    database: {
      host: process.env.DATABASE_HOST ?? 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME ?? 'postgres',
      password: process.env.DATABASE_PASSWORD ?? 'postgres',
    },
    discord: {
      token: process.env.DISCORD_TOKEN ?? '',
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    },
  }

  return env
}
