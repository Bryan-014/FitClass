class CreateNotificacoesTable < ActiveRecord::Migration[8.0]
  def change
    create_table "notificacoes", id: :serial, force: :cascade do |t|
      t.integer "user_id", null: false
      t.string "tipo", limit: 20, null: false
      t.text "mensagem", null: false
      t.boolean "lida", default: false, null: false
      t.timestamptz "data_envio", default: -> { "timezone('America/Sao_Paulo'::text, now())" }
    end
    add_foreign_key "notificacoes", "users", column: "user_id", name: "notificacoes_user_id_fkey"
  end
end