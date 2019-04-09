defmodule Backgammon2.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string
      add :password_hash, :string
      add :first, :string
      add :name, :string
      add :wins, :integer
      add :losses, :integer

      timestamps()
    end

    create unique_index(:users, [:email])

  end
end
