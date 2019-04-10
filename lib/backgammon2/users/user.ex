defmodule Backgammon2.Users.User do
  use Ecto.Schema
  import Ecto.Changeset


  schema "users" do
    field :email, :string
    field :password_hash, :string
    field :first, :string
    field :last, :string
    field :wins, :integer
    field :losses, :integer

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :password_hash, :first, :last, :wins, :losses])
    |> validate_required([:email, :password_hash, :first, :last])
  end
end
