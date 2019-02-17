defmodule BackgammonWeb.GamesChannel do
  use BackgammonWeb, :channel

  alias Backgammon.Game

  def join("games:" <> name, %{"user" => user} = payload, socket) do
    if authorized?(payload) do
      Backgammon.GameServer.reg(name)
      Backgammon.GameServer.start(name)

      reply = Backgammon.GameServer.join(name, user)

      socket = socket
      |> assign(:name, name)
      |> assign(:user, user)

      case reply do
        {:ok, game} -> {:ok, %{game: Game.client_view(game, user)}, socket}
        {:error, msg} -> {:error, %{msg: msg}}
        _ -> {:error, %{msg: "unknown error"}}
      end
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def set_game_and_notify(socket, game) do
    user = socket.assigns[:user]
    broadcast(socket, "update", %{game: Game.client_view(game, user)})
  end

  def handle_in("roll", payload, socket) do
    user = socket.assigns[:user]
    g = Backgammon.GameServer.roll(socket.assigns[:name], user)
    case g do
      {:ok, game} -> broadcast(socket, "update", %{game: Game.client_view(game, user)})
          {:noreply, socket}
      {:error, msg} -> {:reply, {:error, %{msg: msg}}, socket}
      _ -> {:reply, {:error, %{msg: "unknown error"}}, socket}
    end
  end

  def handle_in("move", payload, socket) do
    user = socket.assigns[:user]
    [from, to] = payload["move"]
    from_idx = parseFromVal(from)
    {to_idx, _} = Integer.parse(to)
    g = Backgammon.GameServer.move(socket.assigns[:name],
                                    [from_idx, to_idx],
                                    user)

    case g do
      {:ok, game} -> broadcast(socket, "update", %{game: Game.client_view(game, user)})
                    {:noreply, socket}
      {:error, msg} -> {:reply, {:error, %{msg: msg}}, socket}
      _ -> {:reply, {:error, %{msg: "unknown error"}}, socket}
    end
  end

  def parseFromVal(index) do
    if index == "knocked" do
      :knocked
    else
      {val, _} = Integer.parse(index)
      val
    end
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
