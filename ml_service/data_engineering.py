import pandas as pd
import numpy as np

def load_cargo_fleet_data(file_path="Dataset_Cargo.csv"):
    df = pd.read_csv(file_path)
    bulk_df = df.pivot(index='Year', columns='Item', values='Dry Cargo Bulk Carrier').reset_index()
    bulk_df.columns.name = None
    
    bulk_df['DWT'] = bulk_df['DWT'].interpolate(method='linear')
    bulk_df['No. of Vessels'] = bulk_df['No. of Vessels'].interpolate(method='linear')
    
    bulk_df['Avg_DWT_Per_Vessel'] = (bulk_df['DWT'] / bulk_df['No. of Vessels']) * 1000
    bulk_df['DWT_YoY_Growth'] = bulk_df['DWT'].pct_change().fillna(0) * 100
    bulk_df['DWT_5Yr_MA'] = bulk_df['DWT'].rolling(window=5, min_periods=1).mean()
    
    return bulk_df

def generate_market_indicators(days=90):
    np.random.seed(42)
    dates = pd.date_range(end=pd.Timestamp.today(), periods=days, freq='D')
    bdi = 1500 + np.cumsum(np.random.normal(0, 20, size=days))
    
    df = pd.DataFrame({'date': dates, 'bdi': bdi})
    df['ema_7'] = df['bdi'].ewm(span=7, adjust=False).mean()
    df['ema_30'] = df['bdi'].ewm(span=30, adjust=False).mean()
    df['market_trend'] = np.where(df['ema_7'] > df['ema_30'], 'Bullish', 'Bearish')
    return df