# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :backgammon_2,
  ecto_repos: [Backgammon2.Repo]


# Configures the endpoint
config :backgammon_2, Backgammon2Web.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "srsgAtljdoJ36z+VGabQfKmLq6rnBP+bbNCCPfhxYfJd9X62yKd28GHb9j1CYlR4",
  render_errors: [view: Backgammon2Web.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Backgammon2.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :backgammon_2, Backgammon2.Repo,
  username: "backgammon_2",
  password: "base12ball",
  database: "backgammon2_dev",
  hostname: "localhost",
  pool_size: 10

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
# import_config "#{Mix.env()}.exs"