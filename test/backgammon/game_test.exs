defmodule GameTest do
  use ExUnit.Case

  alias Backgammon.Game

  test "possible moves for red with knocked pieces" do
    slots = [%{idx: 0}, %{idx: 1}, %{idx: 2}, %{idx: 3}]
    game = %{
      slots: slots,
      whose_turn: :red,
      knocked: %{
        red: 1,
        white: 1
      },
      current_dice: [1],
    }
    moves = Game.possible_moves(game)
    assert moves == [[:knocked, 3]]

    game = %{game | whose_turn: :white}
    moves = Game.possible_moves(game)
    assert moves == [[:knocked, 0]]
  end

end
