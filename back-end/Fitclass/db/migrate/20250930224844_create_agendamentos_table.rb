class CreateAgendamentosTable < ActiveRecord::Migration[8.0]
  def change
    create_table "agendamentos", id: :serial, force: :cascade do |t|
      t.integer "aluno_id", null: false
      t.integer "sessao_aula_id", null: false
      t.column "status", :status_agendamento, null: false 
      t.boolean "compareceu", default: false, null: false
      t.timestamptz "data_agendamento", default: -> { "timezone('America/Sao_Paulo'::text, now())" }
      t.timestamptz "notificacao_expira_em"

      t.unique_constraint ["aluno_id", "sessao_aula_id"], name: "agendamentos_aluno_id_sessao_aula_id_key"
    end
    add_foreign_key "agendamentos", "alunos", primary_key: "user_id", name: "agendamentos_aluno_id_fkey"
    add_foreign_key "agendamentos", "sessoes_aulas", column: "sessao_aula_id", name: "agendamentos_sessao_aula_id_fkey"
  end
end