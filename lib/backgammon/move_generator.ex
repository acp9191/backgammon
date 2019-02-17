defmodule Backgammon.MoveGenerator do
  # A Move is:
  # {from: Location, to: Location, die: Number}
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
    home = home_moves(slots, game.knocked[whose_turn], game.current_dice, whose_turn)
    if game.knocked[whose_turn] > 0 do
      home ++ knocked_moves(slots, game.current_dice, whose_turn)
    else
      home ++ possible_moves(slots, game.current_dice, whose_turn)
    end
  end

  # Returns all possible moves to the home slot
  def home_moves(slots, knocked_count, dice, player) do
    if knocked_count > 0 or !can_move_home?(slots, 0, player) do
      []
    else
      moves_home_with_dice(slots, dice, player)
    end
  end

  # Checks if the player can move home, which is true if all of its pieces
  # are in the last 6 slots
  def can_move_home?([slot | rest], seen_so_far, player) do
    if seen_so_far == 18 do
      true
    else
      if Map.has_key?(slot, :owner) and slot.owner == player do
        false
      else
        can_move_home?(rest, seen_so_far + 1, player)
      end
    end
  end

  # Returns all moves into the home slot using the current slots, and the
  # given dice
  def moves_home_with_dice(slots, dice, player) do
    []
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
  def possible_moves(_slots, [], _player) do
    []
  end

  def possible_moves(slots, [die | rest], player) do
    rest_die_moves = possible_moves(slots, rest, player)
    rest_die_moves ++ moves_with_die(slots, die, player)
  end

  # returns all possible moves with the given die in the given slots by the
  # player
  def moves_with_die([slot | rest], die, player) do
    moves_in_rest = moves_with_die(rest, die, player)
    if Map.has_key?(slot, :owner) and slot.owner == player do
      move = move_to_slot([slot | rest], die, die, player)
      if move do
        [%{from: slot.idx, to: move.destination, die: move.die}] ++ moves_in_rest
      else
        moves_in_rest
      end
    else
      moves_in_rest
    end
  end

  def moves_with_die([], _die, _player) do
    []
  end

  # returns all possible moves off of the bar into the slots
  def knocked_moves(slots, dice, player) do
    dice
    |> Enum.map(&(move_to_slot(slots, &1 - 1, &1, player)))
    |> Enum.filter(&(&1 != nil))
    |> Enum.map(&(%{
      from: :knocked,
      to: &1.destination,
      die: &1.die
      }))
  end

  # Returns the id of the slot that the player can move to, or nil
  # if the move is illegal
  def move_to_slot([], _dice, _initial_dice, _player) do
    nil
  end

  def move_to_slot([slot | rest], 0, initial_dice, player) do
    if !Map.has_key?(slot, :owner) or
              slot.owner == player or
              slot.num == 1 do
      %{destination: slot.idx, die: initial_dice}
    else
      nil
    end
  end

  def move_to_slot([slot | rest], dice, initial_dice, player) do
    move_to_slot(rest, dice - 1, initial_dice, player)
  end
end
