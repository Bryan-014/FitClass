class Instrutor < ApplicationRecord
  self.primary_key = 'user_id'


  belongs_to :user, foreign_key: 'user_id'
  

  has_many :sessoes_aulas, foreign_key: 'instrutor_id', dependent: :destroy
  
  validates :especialidade, presence: true, length: { maximum: 100 }
end