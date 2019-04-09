defmodule Backgammon2.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    # List all child processes to be supervised
    children = [
      # Start the Ecto repository
      Backgammon2.Repo,
      # Start the endpoint when the application starts
      Backgammon2Web.Endpoint,
      Backgammon2.BackupAgent,
      # Starts a worker by calling: Backgammon2.Worker.start_link(arg)
      # {Backgammon2.Worker, arg},
      Backgammon2.GameSup
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Backgammon2.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    Backgammon2Web.Endpoint.config_change(changed, removed)
    :ok
  end
end
