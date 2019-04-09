defmodule Backgammon2Web.AuthController do
  use Backgammon2Web, :controller

  alias Backgammon2.Users

  action_fallback Backgammon2Web.FallbackController

  def authorize(conn, %{"email" => email, "password" => password}) do
    with user <- Users.get_user_by_email(email),
          {:ok, user} <- Argon2.check_pass(user, password) do
      conn
      |> assign(:user_id, user.id)
      |> json(%{
        "data" => %{
          "token" => Phoenix.Token.sign(Backgammon2Web.Endpoint, "user_id", user.id),
          "user_id" => user.id,
          "email" => user.email,
          "first" => user.first
        }
      })
    end
  end
end
