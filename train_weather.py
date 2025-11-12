from app.models.weather_model import WeatherModel

if __name__ == '__main__':
    m = WeatherModel()
    m.train(data_path='data/market_researcher_dataset.csv')
