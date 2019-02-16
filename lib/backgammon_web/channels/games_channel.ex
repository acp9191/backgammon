defmodule BackgammonWeb.GamesChannel do
  use BackgammonWeb, :channel

  alias Backgammon.Game

  # TODO: GameAgent
  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      Backgammon.GameServer.reg(name)
      Backgammon.GameServer.start(name)
      g = Backgammon.GameServer.peek(name)
      socket = socket
      |> assign(:name, name)
      {:ok, %{game: Game.client_view(g)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def set_game_and_notify(socket, game) do
    # GameAgent.set(socket.assigns[:name], game)
    broadcast(socket, "update", %{game: Game.client_view(game)})
  end

  # TODO change this
  def handle_in("roll", payload, socket) do
    g = Backgammon.GameServer.roll(socket.assigns[:name])
    # resp = %{ "roll" => :rand.uniform(6) }
    broadcast(socket, "update", %{game: Game.client_view(g)})
    {:noreply, socket}
  end

  def handle_in("move", payload, socket) do
    [from, to] = payload["move"]
    {from_idx, _} = Integer.parse(from)
    {to_idx, _} = Integer.parse(to)
    g = Backgammon.GameServer.move(socket.assigns[:name], [from_idx, to_idx])
    # resp = %{ "roll" => :rand.uniform(6) }
    broadcast(socket, "update", %{game: Game.client_view(g)})
    {:noreply, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
