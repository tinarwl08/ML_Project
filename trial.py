import requests

def get_weather_data(lat, lon, start_date, end_date, parameters):
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = {
        'parameters': ','.join(parameters),
        'community': 'AG',
        'longitude': lon,
        'latitude': lat,
        'start': start_date,
        'end': end_date,
        'format': 'JSON'
    }
    response = requests.get(url, params=params)
    return response.json()

# Example usage
lat = 18.5204  # Latitude for Karad, Maharashtra
lon = 73.8567  # Longitude for Karad, Maharashtra
start_date = '20250917'
end_date = '20250917'
parameters = ['T2M', 'PRECTOTCORR', 'RH2M', 'WS2M', 'GWETTOP']

data = get_weather_data(lat, lon, start_date, end_date, parameters)

print(data['properties']['parameter'])