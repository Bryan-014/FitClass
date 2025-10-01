class Aluno < ApplicationRecord

  self.primary_key = 'user_id' 


  belongs_to :user, foreign_key: 'user_id'
  

  has_many :agendamentos, foreign_key: 'aluno_id', dependent: :destroy
  has_many :sessoes_aulas, through: :agendamentos

  def penalizado?
    penalizado_ate.present? && penalizado_ate > Time.current
  end
end