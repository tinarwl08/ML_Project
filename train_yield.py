from app.models.yield_model import YieldModel

if __name__ == '__main__':
    m = YieldModel()
    m.train(data_path='data/farmer_advisor_dataset.csv')
