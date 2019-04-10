defmodule Backgammon2.Users.User do
  use Ecto.Schema
  import Ecto.Changeset


  schema "users" do
    field :username, :string
    field :password_hash, :string
    field :wins, :integer
    field :losses, :integer

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:username, :password_hash, :wins, :losses])
    |> validate_required([:username, :password_hash])
  end
end
