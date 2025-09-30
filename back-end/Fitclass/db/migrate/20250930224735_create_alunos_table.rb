class CreateAlunosTable < ActiveRecord::Migration[8.0]
  def change
    create_table :alunos, primary_key: "user_id", id: :integer, default: nil, force: :cascade do |t|
      t.timestamptz :penalizado_ate
    end
    add_foreign_key "alunos", "users", column: "user_id", name: "alunos_user_id_fkey", on_delete: :cascade
  end
end