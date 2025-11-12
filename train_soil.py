from app.models.soil_model import SoilModel

if __name__ == '__main__':
    m = SoilModel()
    m.train(data_path='data/farmer_advisor_dataset.csv')
