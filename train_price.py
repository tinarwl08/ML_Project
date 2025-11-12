from app.models.price_model import PriceModel

if __name__ == '__main__':
    m = PriceModel()
    m.train(data_path='data/market_researcher_dataset.csv')
