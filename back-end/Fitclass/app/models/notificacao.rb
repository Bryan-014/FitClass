class Notificacao < ApplicationRecord
  belongs_to :user, foreign_key: 'user_id'
  
  validates :tipo, presence: true, length: { maximum: 20 }
  validates :mensagem, presence: true

  scope :nao_lidas, -> { where(lida: false) }
end