class CreateUsersTableWithDevise < ActiveRecord::Migration[8.0]
  def change
    # execute <<-SQL
    #   CREATE TYPE status_agendamento AS ENUM ('CONFIRMADO', 'LISTA_DE_ESPERA', 'CANCELADO_PELO_ALUNO', 'AUSENTE');
    # SQL

    create_table :users, id: :serial, force: :cascade do |t| 
      t.string "nome", limit: 100, null: false
      t.string "email", limit: 100, null: false, default: ""

      t.string "encrypted_password", limit: 255, null: false, default: ""
      t.string "reset_password_token"
      t.timestamptz "reset_password_sent_at"
      t.timestamptz "remember_created_at"
      
      t.timestamptz "criado_em", default: -> { "timezone('America/Sao_Paulo'::text, now())" }

      t.unique_constraint ["email"], name: "users_email_key"
      t.index ["email"], name: "index_users_on_email", unique: true
      t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    end
  end
end