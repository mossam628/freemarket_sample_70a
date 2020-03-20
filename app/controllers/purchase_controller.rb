class PurchaseController < ApplicationController
  before_action :set_item, only: [:show, :pay, :done]

  require 'payjp'

  def show
    @images = @item.item_images
    @image = @images.first
    card = Card.where(user_id: current_user.id).first
    
    #Cardテーブルは前回記事で作成、テーブルからpayjpの顧客IDを検索
    if card.blank?
      #登録された情報がない場合にカード登録画面に移動
      redirect_to card_new_path  #controller: "card", action: "new"
    else
      Payjp.api_key = ENV["PAYJP_PRIVATE_KEY"]
      #保管した顧客IDでpayjpから情報取得
      customer = Payjp::Customer.retrieve(card.customer_id)
      #保管したカードIDでpayjpから情報取得、カード情報表示のためインスタンス変数に代入
      @default_card_information = customer.cards.retrieve(card.card_id)
    end
  end

  def pay
    card = Card.where(user_id: current_user.id).first
    Payjp.api_key = ENV['PAYJP_PRIVATE_KEY']
    Payjp::Charge.create(
      :amount => 13500, #支払金額を入力（itemテーブル等に紐づけても良い）
      :customer => card.customer_id, #顧客ID
      :currency => 'jpy', #日本円
    )
    redirect_to action: 'done' #完了画面に移動
  end

  def done
    @item_buyer = Item.find(params[:id])
    @item_buyer.update( buyer_id: current_user.id)
    @images = @item.item_images
    @image = @images.first
  end

  private
  def set_item
    @item = Item.find(params[:id])
  end

end
