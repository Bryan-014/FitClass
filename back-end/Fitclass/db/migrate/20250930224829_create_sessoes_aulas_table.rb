class CreateSessoesAulasTable < ActiveRecord::Migration[8.0]
  def change
    create_table "sessoes_aulas", id: :serial, force: :cascade do |t|
      t.string "nome", limit: 100, null: false
      t.text "descricao"
      t.integer "instrutor_id", null: false
      t.timestamptz "data_hora_inicio", null: false
      t.integer "duracao_minutos", default: 60, null: false
      t.integer "capacidade", null: false
      t.integer "limite_cancelamento_horas", default: 2, null: false
      t.timestamptz "criado_em", default: -> { "timezone('America/Sao_Paulo'::text, now())" }
    end
    add_foreign_key "sessoes_aulas", "users", column: "instrutor_id", primary_key: "id", name: "sessoes_aulas_instrutor_id_fkey"
  end
end