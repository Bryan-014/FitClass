class User < ApplicationRecord

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self  
  has_one :aluno, foreign_key: 'user_id', dependent: :destroy
  has_one :instrutor, foreign_key: 'user_id', dependent: :destroy
  

  has_many :notificacoes, dependent: :destroy
  

  validates :nome, presence: true, length: { maximum: 100 }
  
  def is_aluno?
    aluno.present?
  end

  def is_instrutor?
    instrutor.present?
  end
end