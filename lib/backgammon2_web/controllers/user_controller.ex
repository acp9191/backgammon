defmodule Backgammon2Web.UserController do
  use Backgammon2Web, :controller

  alias Backgammon2.Users
  alias Backgammon2.Users.User

  action_fallback Backgammon2Web.FallbackController

  def index(conn, _params) do
    users = Users.list_users()
    render(conn, "index.json", users: users)
  end

  def leaders(conn, _params) do
    users = Enum.take(Users.list_users(), 5)
    render(conn, "index.json", users: users)
  end

  def create(conn, %{"user" => user_params}) do

    with password <- user_params["password"],
      password_hash <- Argon2.hash_pwd_salt(password),
      user_params <- Map.put(user_params, "password_hash", password_hash),
      user_params <- Map.delete(user_params, "password"),
      {:ok, %User{} = user} <- Users.create_user(user_params) do
        
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.user_path(conn, :show, user))
      |> render("show.json", user: user)
    end
  end

  def show(conn, %{"id" => id}) do
    user = Users.get_user!(id)
    render(conn, "show.json", user: user)
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Users.get_user!(id)

    with {:ok, %User{} = user} <- Users.update_user(user, user_params) do
      render(conn, "show.json", user: user)
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Users.get_user!(id)

    with {:ok, %User{}} <- Users.delete_user(user) do
      send_resp(conn, :no_content, "")
    end
  end
end
