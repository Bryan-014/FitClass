class CreateInstrutoresTable < ActiveRecord::Migration[8.0]
  def change
    create_table :instrutores, primary_key: "user_id", id: :integer, default: nil, force: :cascade do |t|
      t.string "especialidade", limit: 100
    end
    add_foreign_key "instrutores", "users", column: "user_id", name: "instrutores_user_id_fkey", on_delete: :cascade
  end
end