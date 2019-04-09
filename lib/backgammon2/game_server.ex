defmodule Backgammon2.GameServer do
  use GenServer

  def reg(name) do
    {:via, Registry, {Backgammon2.GameReg, name}}
  end

  def start(name) do
    spec = %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [name]},
      restart: :permanent,
      type: :worker,
    }
    Backgammon2.GameSup.start_child(spec)
  end

  def start_link(name) do
    game = Backgammon2.BackupAgent.get(name) || Backgammon2.Game.new()
    GenServer.start_link(__MODULE__, game, name: reg(name))
  end

  def join(name, user) do
    GenServer.call(reg(name), {:join, name, user})
  end

  def move(name, move, user) do
    GenServer.call(reg(name), {:move, name, move, user})
  end

  def roll(name, user) do
    GenServer.call(reg(name), {:roll, name, user})
  end

  def chat(name, chat, user) do
    GenServer.call(reg(name), {:chat, name, chat, user})
  end

  def peek(name) do
    GenServer.call(reg(name), {:peek, name})
  end

  def reset(name) do
    GenServer.call(reg(name), {:reset, name})
  end

  def init(game) do
    {:ok, game}
  end

  def handle_call({:move, name, move, user}, _from, game) do
    with {:ok, game} <- Backgammon2.Game.move(game, move, user) do
      Backgammon2.BackupAgent.put(name, game)
      {:reply, {:ok, game}, game}
    else
      {:error, msg} -> {:reply, {:error, msg}, game}
      _ -> {:reply, {:error, "unknown error"}, game}
    end
  end

  def handle_call({:join, name, user}, _from, game) do
    with {:ok, game} <- Backgammon2.Game.join(game, user) do
      Backgammon2.BackupAgent.put(name, game)
      {:reply, {:ok, game}, game}
    else
      {:error, msg} -> {:reply, {:error, msg}, game}
      _ -> {:reply, {:error, "unknown error"}, game}
    end
  end

  def handle_call({:roll, name, user}, _from, game) do
    with {:ok, game} <- Backgammon2.Game.roll(game, user) do
      Backgammon2.BackupAgent.put(name, game)
      {:reply, {:ok, game}, game}
    else
      {:error, msg} -> {:reply, {:error, msg}, game}
      _ -> {:reply, {:error, "unknown error"}, game}
    end
  end

  def handle_call({:chat, name, chat, user}, _from, game) do
    with {:ok, game} <- Backgammon2.Game.chat(game, chat, user) do
      Backgammon2.BackupAgent.put(name, game)
      {:reply, {:ok, game}, game}
    else
      {:error, msg} -> {:reply, {:error, msg}, game}
      _ -> {:reply, {:error, "unknown error"}, game}
    end
  end

  def handle_call({:peek, _name}, _from, game) do
    {:reply, game, game}
  end

  def handle_call({:reset, _name}, _from, game) do
    if Backgammon2.Game.winner(game) != "" do
      {:reply, {:ok, "reset"}, Backgammon2.Game.new()}
    else
      {:reply, {:error, "game in progress"}, game}
    end
  end
end
