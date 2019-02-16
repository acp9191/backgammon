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
      current_dice: [4, 5]
    }
  end

  def init_slots() do
    [
      %{idx: 0, owner: :white, num: 2},
      %{idx: 1},
      %{idx: 2},
      %{idx: 3},
      %{idx: 4},
      %{idx: 5, owner: :red, num: 5},
      %{idx: 6},
      %{idx: 7, owner: :red, num: 3},
      %{idx: 8},
      %{idx: 9},
      %{idx: 10},
      %{idx: 11, owner: :white, num: 5},
      %{idx: 12, owner: :red, num: 5},
      %{idx: 13},
      %{idx: 14},
      %{idx: 15},
      %{idx: 16, owner: :white, num: 3},
      %{idx: 17},
      %{idx: 18, owner: :white, num: 5},
      %{idx: 19},
      %{idx: 20},
      %{idx: 21},
      %{idx: 22},
      %{idx: 23, owner: :red, num: 2},
    ]
  end

  def client_view(game) do
    Map.put(game, :possible_moves, possible_moves(game))
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
      knocked_moves(game.slots, game.current_dice, whose_turn)
    else
      possible_moves(slots, game.current_dice, whose_turn)
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
  def possible_moves(slots, [], player) do
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
      move = move_to_slot([slot | rest], die, player)
      if move do
        [[slot.idx, move]] ++ moves_in_rest
      else
        moves_in_rest
      end
    else
      moves_in_rest
    end
  end

  def moves_with_die([], die, player) do
    []
  end

  # returns all possible moves off of the bar into the slots
  def knocked_moves(slots, dice, player) do
    dice
    |> Enum.map(&(move_to_slot(slots, &1 - 1, player)))
    |> Enum.filter(&(&1 != nil))
    |> Enum.map(&([:knocked, &1]))
  end

  # Returns the id of the slot that the player can move to, or nil
  # if the move is illegal
  def move_to_slot([], dice, player) do
    nil
  end

  def move_to_slot([slot | rest], 0, player) do
    if !Map.has_key?(slot, :owner) or
              slot.owner == player or
              slot.num == 1 do
      slot.idx
    else
      nil
    end
  end

  def move_to_slot([slot | rest], dice, player) do
    move_to_slot(rest, dice - 1, player)
  end



  # Functions from Game -> Game (taking actions on a game)

  # roll two die and set them as the current dice, doubling them
  # if they are the same
  def roll(g) do
    new_dice = random_dice()
    Map.put(g, :current_dice, new_dice)
  end

  # randomly generates the new dice for the
  def random_dice() do
    d1 = :rand.uniform(6)
    d2 = :rand.uniform(6)
    # if the dice are the same, they get "doubled"
    if d1 == d2 do
      [d1, d2, d1, d2]
    else
      [d1, d2]
    end
  end


  # returns the game state after enacting the given move
  def move(g, move = [from, to]) do
    IO.inspect(move)
    if valid_move?(g, move) do
      new_slots = update_slots(g.slots, move, g.whose_turn)
      die = die_used(from, to, g.whose_turn)
      new_dice = remove_die(g.current_dice, die)
      new_player = next_player(g.whose_turn, new_dice)
      to_slot = Enum.find(g.slots, &(&1.idx == to))
      new_knocked = g.knocked
                    |> decrement_knocked(from, g.whose_turn)
                    |> increment_knocked(to_slot, g.whose_turn)
      new_home = next_home(g.home, to, g.whose_turn)
      %{
        slots: new_slots,
        knocked: new_knocked,
        home: new_home,
        whose_turn: new_player,
        current_dice: new_dice
      }
    else
      g
    end
  end

  # checks if the given move is valid under the current game state
  def valid_move?(g, move = [from, to]) do
    move in possible_moves(g)
  end

  # returns the new slots after the given move by the given player
  def update_slots([slot | rest], move = [from, to], player) do
    updated_rest = update_slots(rest, move, player)
    if slot.idx in move do
      [update_slot(slot, move, player) | updated_rest]
    else
      [slot | updated_rest]
    end
  end

  def update_slots([], _move, _player) do
    []
  end

  # updates the given slot under the given move
  def update_slot(slot, move = [from, to], player) do
    cur_num = Map.get(slot, :num) || 0
    if slot.idx == from do
      if cur_num == 1 do
        %{idx: slot.idx}
      else
        Map.put(slot, :num, cur_num - 1)
      end
    else
      new_owner = Map.put(slot, :owner, player)
      if Map.has_key?(slot, :owner) and slot.owner != player do
        new_owner
        |> Map.put(:num, 1)
      else
        new_owner
        |> Map.put(:num, cur_num + 1)
      end
    end
  end

  # determines which die was used to make the given move
  def die_used(from, to, _player) when is_number(from) and is_number(to) do
    abs(from - to)
  end

  def die_used(:knocked, to, player) do
    if player == :red do
      24 - to
    else
      to + 1
    end
  end

  def die_used(from, :home, player) do
    if player == :red do
      24 - from
    else
      from + 1
    end
  end

  # removes the first occurence of the given die from the dice
  def remove_die([first | rest], die) do
    if first == die do
      rest
    else
      [first | remove_die(rest, die)]
    end
  end

  def remove_die([], _die) do
    []
  end

  # says whose turn is next - changes the turn if both dice have
  # been used
  def next_player(player, dice) do
    if length(dice) == 0 do
      if player == :white do
        :red
      else
        :white
      end
    else
      player
    end
  end

  # returns the current number of knocked players after the move
  # from the given index
  def decrement_knocked(knocked, from, player) do
    if from == :knocked do
      Map.update(knocked, player, 0, &(&1 - 1))
    else
      knocked
    end
  end

  # increments the knocked count for the player who got knocked
  def increment_knocked(knocked, to_slot, player) do
    if Map.has_key?(to_slot, :owner) and to_slot.owner != player do
      opponent = to_slot.owner
      Map.update(knocked, opponent, 0, &(&1 + 1))
    else
      knocked
    end
  end

  # returns the current number of home players after the move to the given idx
  def next_home(home, to, player) do
    if to == :home do
      Map.put(home, player, Map.get(home, player) + 1)
    else
      home
    end
  end

end
