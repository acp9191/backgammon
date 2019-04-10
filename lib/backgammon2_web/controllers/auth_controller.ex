defmodule Backgammon2Web.AuthController do
  use Backgammon2Web, :controller

  alias Backgammon2.Users

  action_fallback Backgammon2Web.FallbackController

  def authorize(conn, %{"username" => username, "password" => password}) do
    with user <- Users.get_user_by_username(username),
          {:ok, user} <- Argon2.check_pass(user, password) do
      conn
      |> assign(:user_id, user.id)
      |> json(%{
        "data" => %{
          "token" => Phoenix.Token.sign(Backgammon2Web.Endpoint, "user_id", user.id),
          "user_id" => user.id,
          "username" => user.username,
          "wins" => user.wins,
          "losses" => user.losses
        }
      })
    end
  end
end
