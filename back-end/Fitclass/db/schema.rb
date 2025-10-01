# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_09_30_230644) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  # Custom types defined in this database.
  # Note that some types may not work with other database engines. Be careful if changing database.
  create_enum "status_agendamento", ["CONFIRMADO", "LISTA_DE_ESPERA", "CANCELADO_PELO_ALUNO", "AUSENTE"]

  create_table "agendamentos_tables", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "alunos", primary_key: "user_id", id: :integer, default: nil, force: :cascade do |t|
    t.timestamptz "penalizado_ate"
  end

  create_table "instrutores", primary_key: "user_id", id: :integer, default: nil, force: :cascade do |t|
    t.string "especialidade", limit: 100
  end

  create_table "notificacoes_tables", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

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

  create_table "users", id: :serial, force: :cascade do |t|
    t.string "nome", limit: 100, null: false
    t.string "email", limit: 100, default: "", null: false
    t.string "encrypted_password", limit: 255, default: "", null: false
    t.string "reset_password_token"
    t.timestamptz "reset_password_sent_at"
    t.timestamptz "remember_created_at"
    t.timestamptz "criado_em", default: -> { "timezone('America/Sao_Paulo'::text, now())" }
    t.string "jti", default: "", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.unique_constraint ["email"], name: "users_email_key"
  end

  add_foreign_key "alunos", "users", name: "alunos_user_id_fkey", on_delete: :cascade
  add_foreign_key "instrutores", "users", name: "instrutores_user_id_fkey", on_delete: :cascade
  add_foreign_key "sessoes_aulas", "users", column: "instrutor_id", name: "sessoes_aulas_instrutor_id_fkey"
end
