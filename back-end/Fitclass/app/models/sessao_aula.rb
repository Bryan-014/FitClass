class SessaoAula < ApplicationRecord
  belongs_to :instrutor, foreign_key: 'instrutor_id', class_name: 'User'
  

  has_many :agendamentos, foreign_key: 'sessao_aula_id', dependent: :destroy
  has_many :alunos, through: :agendamentos


  validates :nome, presence: true, length: { maximum: 100 }
  validates :data_hora_inicio, presence: true
  validates :duracao_minutos, presence: true, numericality: { greater_than: 0 }
  validates :capacidade, presence: true, numericality: { greater_than: 0 }
  validates :limite_cancelamento_horas, presence: true, numericality: { greater_than_or_equal_to: 0 }


  def vagas_restantes
    capacidade - agendamentos.where(status: 'CONFIRMADO').count
  end
end