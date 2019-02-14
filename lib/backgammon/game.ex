defmodule Backgammon.Game do

  def new do
    %{
      slots: init_slots(),
      knocked: %{
        red: 0,
        white: 0,
      },
      home: %{
        red: 0,
        white: 0,
      },
      whose_turn: :white,
      current_dice: []
    }
  end

  def init_slots() do
    [
      %{owner: :white, num: 2},
      %{},
      %{},
      %{},
      %{},
      %{owner: :red, num: 5},
      %{},
      %{owner: :red, num: 3},
      %{},
      %{},
      %{},
      %{owner: :white, num: 5},
      %{owner: :red, num: 5},
      %{},
      %{},
      %{},
      %{owner: :white, num: 3},
      %{},
      %{owner: :white, num: 5},
      %{},
      %{},
      %{},
      %{},
      %{owner: :red, num: 2},
    ]
  end

  def client_view(game) do
    game
  end

  # A Move is:
  # [Location, Location]
  # rep a movement of a tile from the first location to the second
  # Location is one of:
  # - Number [index in slots 0-23]
  # - "knocked" = slot for tiles knocked off
  # - "home" = the player's home bank

  # Given a game, returns all possible moves for that
  # player using the current dice
  def possible_moves(game) do
    whose_turn = game.whose_turn
    slots = ordered_slots(game.slots, game.whose_turn)
    if game.knocked[whose_turn] > 0 do
      [] #knocked_moves(game.slots, game.dice, whose_turn)
    else
      possible_moves(slots, game.dice, whose_turn)
    end
  end

  # Returns the slots ordered such that the player whose
  # turn it is moves from slots earlier in the list
  # to slots later in the list
  def ordered_slots(slots, whose_turn) do
    if whose_turn == :white do
      slots
    else
      Enum.reverse(slots)
    end
  end

  # returns all possible moves by the given player with the given dice roll
  def possible_moves([], dice, player) do
    []
  end

  def possible_moves(slots, [], player) do
    []
  end

  def possible_moves(slots, [die | rest], player) do

  end


  # returns all possible moves with the given die in the given slots by the
  # player
  def moves_with_die(slots, die, player) do

  end

  # returns all possible moves off of the bar into the slots
  def knocked_moves(slots, dice, player) do
    dice
    |> Enum.filter(&(can_move_to(slots, &1 - 1, player)))
    |> Enum.map(&([:knocked, &1 - 1]))
  end

  # determines if the given player can move to a square that's "dice"
  # slots away
  def can_move_to([], dice, player) do
    false
  end

  def can_move_to([slot | rest], 0, player) do
    slot == %{} or
    slot.owner == player or
    slot.num == 1
  end

  def can_move_to([slot | rest], dice, player) do
    can_move_to(rest, dice - 1, player)
  end



end
