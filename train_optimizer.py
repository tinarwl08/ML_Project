from app.models.optimizer import OptimizerModel

if __name__ == '__main__':
    m = OptimizerModel()
    m.train(data_path='data/farmer_advisor_dataset.csv')
