defmodule Backgammon.Game do
  
  def new do
    %{
      slots: init_slots(),
      knocked_red: 0,
      knocked_white: 0,
      home_red: 0,
      home_white: 0,
      whose_turn: "white",
      current_dice: []
    }
  end

  def client_view(game) do
    game
  end

  def init_slots do
    nil
  end

end