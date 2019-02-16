defmodule Backgammon.GameServer do
  use GenServer

  def reg(name) do
    {:via, Registry, {Backgammon.GameReg, name}}
  end

  def start(name) do
    spec = %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [name]},
      restart: :permanent,
      type: :worker,
    }
    Backgammon.GameSup.start_child(spec)
  end

  def start_link(name) do
    game = Backgammon.BackupAgent.get(name) || Backgammon.Game.new()
    GenServer.start_link(__MODULE__, game, name: reg(name))
  end

  def move(name, move) do
    GenServer.call(reg(name), {:move, name, move})
  end

  def roll(name) do
    GenServer.call(reg(name), {:roll, name})
  end

  def peek(name) do
    GenServer.call(reg(name), {:peek, name})
  end

  def init(game) do
    {:ok, game}
  end

  def handle_call({:move, name, move}, _from, game) do
    game = Backgammon.Game.move(game, move)
    Backgammon.BackupAgent.put(name, game)
    {:reply, game, game}
  end

  def handle_call({:roll, name}, _from, game) do
    game = Backgammon.Game.roll(game)
    Backgammon.BackupAgent.put(name, game)
    {:reply, game, game}
  end

  def handle_call({:peek, _name}, _from, game) do
    {:reply, game, game}
  end
end
