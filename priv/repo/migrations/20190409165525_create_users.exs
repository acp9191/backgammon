defmodule Backgammon2.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :first, :string
      add :last, :string
      add :email, :string
      add :pw_hash, :string
      add :wins, :integer
      add :losses, :integer

      timestamps()
    end

  end
end
