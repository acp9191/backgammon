defmodule Backgammon2Web.GamesChannel do
  use Backgammon2Web, :channel

  alias Backgammon2.Game

  def join("games:" <> name, %{"user" => user} = payload, socket) do
    if authorized?(payload) do
      Backgammon2.GameServer.reg(name)
      Backgammon2.GameServer.start(name)

      reply = Backgammon2.GameServer.join(name, user)

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

  def handle_in("roll", _payload, socket) do
    user = socket.assigns[:user]
    g = Backgammon2.GameServer.roll(socket.assigns[:name], user)
    case g do
      {:ok, game} -> broadcast(socket, "update", %{game: Game.client_view(game, user)})
          {:noreply, socket}
      {:error, msg} -> {:reply, {:error, %{msg: msg}}, socket}
      _ -> {:reply, {:error, %{msg: "unknown error"}}, socket}
    end
  end

  def handle_in("reset", _payload, socket) do
    Backgammon2.GameServer.reset(socket.assigns[:name])
    broadcast(socket, "reset", %{msg: "Game reset by #{socket.assigns[:user]}"})
    {:noreply, socket}
  end

  def handle_in("chat", payload, socket) do
    user = socket.assigns[:user]
    g = Backgammon2.GameServer.chat(socket.assigns[:name], payload["chat"], user)
    case g do
      {:ok, game} -> broadcast(socket, "update", %{game: Game.client_view(game, user)})
                    {:noreply, socket}
      {:error, msg} -> {:reply, {:error, %{msg: msg}}, socket}
      _ -> {:reply, {:error, %{msg: "unknown error"}}, socket}
    end
  end


  def handle_in("move", payload, socket) do
    user = socket.assigns[:user]
    %{"from" => from, "to" => to, "die" => die} = payload["move"]
    from_idx = parseFromVal(from)
    to_idx = parseToVal(to)
    g = Backgammon2.GameServer.move(socket.assigns[:name],
                                    %{from: from_idx, to: to_idx, die: die},
                                    user)

    case g do
      {:ok, game} -> broadcast(socket, "update", %{game: Game.client_view(game, user)})
                    {:noreply, socket}
      {:error, msg} -> {:reply, {:error, %{msg: msg}}, socket}
      _ -> {:reply, {:error, %{msg: "unknown error"}}, socket}
    end
  end

  def parseFromVal("knocked"), do: :knocked
  def parseFromVal(fromIdx) when is_number(fromIdx), do: fromIdx

  def parseToVal("home"), do: :home
  def parseToVal(toIdx) when is_number(toIdx), do: toIdx

  defp authorized?(_payload) do
    true
  end
end
